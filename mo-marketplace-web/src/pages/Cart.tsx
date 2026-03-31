import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  productId: number;
  productName: string;
  variantId: number;
  color: string;
  size: string;
  material: string;
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = () => {
    try {
      const rawCart = localStorage.getItem('cart_items');
      const parsed = rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];
      setItems(parsed);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadCart();

    const syncCart = () => loadCart();
    window.addEventListener('storage', syncCart);
    window.addEventListener('cart-updated', syncCart as EventListener);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('cart-updated', syncCart as EventListener);
    };
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + (item.quantity || 0), 0),
    [items],
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    const isConfirmed = window.confirm('Proceed to checkout with current cart items?');
    if (!isConfirmed) {
      return;
    }

    localStorage.removeItem('cart_items');
    window.dispatchEvent(new Event('cart-updated'));
    setItems([]);
    alert('Checkout completed successfully.');
    navigate('/');
  };

  return (
    <section className="panel">
      <div className="panel-body form-stack">
        <div className="row">
          <h2 className="headline">Cart</h2>
          <Link className="link-btn btn btn-secondary" to="/">Back to Products</Link>
        </div>

        <span className="pill">Total items: {totalItems}</span>

        <div className="action-group">
          <button
            type="button"
            className="btn btn-primary"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>

        {items.length === 0 ? (
          <p className="subtle">Your cart is empty.</p>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <article key={item.variantId} className="product-card">
                <h3 className="headline">{item.productName}</h3>
                <p className="subtle">
                  {item.color} / {item.size} / {item.material}
                </p>
                <span className="pill">Quantity: {item.quantity}</span>
                <Link className="link-btn btn btn-secondary" to={`/products/${item.productId}`}>
                  View Product
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}