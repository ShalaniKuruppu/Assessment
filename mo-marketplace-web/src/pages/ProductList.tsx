import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>

      {products.map(product => (
        <div key={product.id} style={{
          border: '1px solid #ccc',
          marginBottom: '10px',
          padding: '10px'
        }}>
          <h2>
            <Link to={`/products/${product.id}`}>
                {product.name}
            </Link>
          </h2>
          <p>{product.description}</p>

          <h4>Variants:</h4>
          <ul>
            {product.variants.map(v => (
              <li key={v.id}>
                {v.color} - {v.size} - {v.material} 
                ({v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}