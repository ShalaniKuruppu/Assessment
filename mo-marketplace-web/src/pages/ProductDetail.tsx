import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../store/AuthContext';

interface Variant {
  id: number;
  color: string;
  size: string;
  material: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  variants: Variant[];
}

interface CartItem {
  productId: number;
  productName: string;
  variantId: number;
  color: string;
  size: string;
  material: string;
  quantity: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [cartNotice, setCartNotice] = useState(
    (location.state as { notice?: string } | null)?.notice ?? '',
  );
  const getCartCount = () => {
    try {
      const rawCart = localStorage.getItem('cart_items');
      if (!rawCart) {
        return 0;
      }

      const cartItems = JSON.parse(rawCart) as CartItem[];
      return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    } catch {
      return 0;
    }
  };
  const [cartCount, setCartCount] = useState(getCartCount);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());

    window.addEventListener('storage', syncCart);
    window.addEventListener('cart-updated', syncCart as EventListener);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('cart-updated', syncCart as EventListener);
    };
  }, []);

  if (!product) {
    return (
      <section className="panel">
        <div className="panel-body">
          <p className="subtle">Loading product details...</p>
        </div>
      </section>
    );
  }

  const colors = [...new Set(product.variants.map(v => v.color))];
  const sizes = [...new Set(product.variants.map(v => v.size))];
  const materials = [...new Set(product.variants.map(v => v.material))];


  const selectedVariant = product.variants.find(
    (v) =>
      v.color === selectedColor &&
      v.size === selectedSize &&
      v.material === selectedMaterial,
  );
  const hasAnySelection = Boolean(selectedColor || selectedSize || selectedMaterial);
  const isFullSelection = Boolean(selectedColor && selectedSize && selectedMaterial);
  const matchingVariants = product.variants.filter((variant) => {
    const colorMatch = !selectedColor || variant.color === selectedColor;
    const sizeMatch = !selectedSize || variant.size === selectedSize;
    const materialMatch = !selectedMaterial || variant.material === selectedMaterial;

    return colorMatch && sizeMatch && materialMatch;
  });
  const hasInStockMatch = matchingVariants.some((variant) => variant.stock > 0);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setCartNotice('Please sign in to add items to cart. Redirecting...');
      navigate(`/login?redirect=/products/${product.id}`);
      return;
    }

    if (!selectedVariant || selectedVariant.stock === 0) {
      return;
    }

    const nextItem: CartItem = {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      color: selectedVariant.color,
      size: selectedVariant.size,
      material: selectedVariant.material,
      quantity: 1,
    };

    const rawCart = localStorage.getItem('cart_items');
    const cart: CartItem[] = rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];
    const existing = cart.find((item) => item.variantId === nextItem.variantId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(nextItem);
    }

    localStorage.setItem('cart_items', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setCartNotice('Added to cart.');
  };

  const handleQuickBuy = () => {
    if (!selectedVariant || selectedVariant.stock === 0) {
      return;
    }

    navigate('/checkout', {
      state: {
        source: 'quick-buy',
        quickBuyItem: {
          productId: product.id,
          productName: product.name,
          color: selectedVariant.color,
          size: selectedVariant.size,
          material: selectedVariant.material,
        },
      },
    });
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Delete this product? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);
      navigate('/', {
        state: { notice: 'Product deleted successfully.' },
      });
    } catch (err) {
      console.error(err);
      setCartNotice('Delete failed. Admin access is required.');
    }
  };

  return (
    <section className="panel">
      <div className="panel-body form-stack">
        <div className="row">
          <Link className="link-btn btn btn-secondary" to="/">Back to Products</Link>
          <div className="row">
            {isAdmin ? (
              <>
                <Link className="link-btn btn btn-secondary" to={`/products/${product.id}/edit`}>
                  Edit Product
                </Link>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete Product
                </button>
              </>
            ) : null}
            <span className="pill">Product ID: {product.id}</span>
            <Link className="pill link-btn" to="/cart">Cart: {cartCount}</Link>
          </div>
        </div>

        <h2 className="headline">{product.name}</h2>
        <p className="subtle">{product.description}</p>

        <h3 className="headline">Select Variant</h3>
        <p className="subtle">Select any combination to check stock availability.</p>

        <div className="select-grid">
          <select
            className="select"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">Choose color</option>
            {colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>

          <select
            className="select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Choose size</option>
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>

          <select
            className="select"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Choose material</option>
            {materials.map((material) => (
              <option key={material}>{material}</option>
            ))}
          </select>
        </div>

        {isFullSelection ? (
          selectedVariant ? (
            <span className={`status ${selectedVariant.stock > 0 ? 'status-ok' : 'status-bad'}`}>
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
            </span>
          ) : (
            <span className="status status-bad">Out of stock</span>
          )
        ) : hasAnySelection && matchingVariants.length > 0 && !hasInStockMatch ? (
          <span className="status status-bad">Out of stock</span>
        ) : (
          <span className="subtle">Choose a full combination to see stock.</span>
        )}

        <div className="action-group">
          <button
            className="btn btn-secondary"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <button
            className="btn btn-primary"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={handleQuickBuy}
          >
            Quick Buy
          </button>
        </div>

        {cartNotice ? <span className="status status-ok">{cartNotice}</span> : null}
      </div>
    </section>
  );
}