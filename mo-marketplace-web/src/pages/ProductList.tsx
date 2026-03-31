import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import AuthActions from '../components/AuthActions';
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

export default function ProductList() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm('Delete this product? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed. Admin access is required.');
    }
  };

  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="panel">
        <div className="panel-body">
          <p className="subtle">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-body">
        <div className="row">
          <div>
            <h2 className="headline">Products</h2>
            <p className="subtle">Explore your inventory with quick access to each variant.</p>
          </div>
          <AuthActions />
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <Link className="product-title-link" to={`/products/${product.id}`}>
                {product.name}
              </Link>
              <p className="subtle">{product.description}</p>
              <span className="pill">{product.variants.length} variants</span>

              {isAdmin ? (
                <div className="row">
                  <Link className="link-btn btn btn-secondary" to={`/products/${product.id}/edit`}>
                    Edit Product
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete Product
                  </button>
                </div>
              ) : null}

              <ul className="variants-list">
                {product.variants.map((variant) => (
                  <li key={variant.id}>
                    {variant.color} / {variant.size} / {variant.material} -{' '}
                    {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}