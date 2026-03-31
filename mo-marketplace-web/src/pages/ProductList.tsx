import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import AuthActions from '../components/AuthActions';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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