import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';

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

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

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

  return (
    <section className="panel">
      <div className="panel-body form-stack">
        <div className="row">
          <Link className="link-btn btn btn-secondary" to="/">Back to Products</Link>
          <span className="pill">Product ID: {product.id}</span>
        </div>

        <h2 className="headline">{product.name}</h2>
        <p className="subtle">{product.description}</p>

        <h3 className="headline">Select Variant</h3>

        <div className="select-grid">
          <select className="select" onChange={(e) => setSelectedColor(e.target.value)}>
            <option value="">Choose color</option>
            {colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>

          <select className="select" onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="">Choose size</option>
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>

          <select className="select" onChange={(e) => setSelectedMaterial(e.target.value)}>
            <option value="">Choose material</option>
            {materials.map((material) => (
              <option key={material}>{material}</option>
            ))}
          </select>
        </div>

        {selectedVariant ? (
          <span className={`status ${selectedVariant.stock > 0 ? 'status-ok' : 'status-bad'}`}>
            {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
          </span>
        ) : (
          <span className="subtle">Choose a full combination to see stock.</span>
        )}

        <div>
          <button
            className="btn btn-primary"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={() => alert(`Buying ${selectedVariant?.color} ${selectedVariant?.size}`)}
          >
            Quick Buy
          </button>
        </div>
      </div>
    </section>
  );
}