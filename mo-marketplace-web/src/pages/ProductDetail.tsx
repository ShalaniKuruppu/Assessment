import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (!product) return <p>Loading...</p>;

  const colors = [...new Set(product.variants.map(v => v.color))];
  const sizes = [...new Set(product.variants.map(v => v.size))];
  const materials = [...new Set(product.variants.map(v => v.material))];


  const selectedVariant = product.variants.find(v =>
  v.color === selectedColor &&
  v.size === selectedSize &&
  v.material === selectedMaterial
);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h3>Select Variant</h3>

      <select onChange={e => setSelectedColor(e.target.value)}>
        <option value="">Color</option>
        {colors.map(c => <option key={c}>{c}</option>)}
      </select>

      <select onChange={e => setSelectedSize(e.target.value)}>
        <option value="">Size</option>
        {sizes.map(s => <option key={s}>{s}</option>)}
      </select>

      <select onChange={e => setSelectedMaterial(e.target.value)}>
        <option value="">Material</option>
        {materials.map(m => <option key={m}>{m}</option>)}
      </select>

      {selectedVariant && (
  <p>
    {selectedVariant.stock > 0
      ? `${selectedVariant.stock} in stock`
      : 'Out of stock'}
  </p>
)}

    <button
      disabled={!selectedVariant || selectedVariant.stock === 0}
      onClick={() =>
        alert(`Buying ${selectedVariant?.color} ${selectedVariant?.size}`)
      }
    >
      Quick Buy
    </button>
      
    </div>
  );
}