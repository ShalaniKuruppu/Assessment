import { useState } from 'react';
import { api } from '../api/client';
import { Link, useNavigate } from 'react-router-dom';

interface Variant {
  color: string;
  size: string;
  material: string;
  stock: number;
}

export default function CreateProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);

  const navigate = useNavigate();

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: '', size: '', material: '', stock: 0 },
    ]);
  };

  const updateVariant = <K extends keyof Variant>(index: number, field: K, value: Variant[K]) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSubmit = async () => {
    try {
      await api.post('/products', {
        name,
        description,
        variants,
      });

      alert('Product created!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    }
  };

  return (
    <section className="panel">
      <div className="panel-body form-stack">
        <div className="row">
          <h2 className="headline">Create Product</h2>
          <Link className="link-btn btn btn-secondary" to="/">Back to List</Link>
        </div>

        <input
          className="field"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <button className="btn btn-secondary" onClick={addVariant}>Add Variant</button>
        </div>

        {variants.map((variant, index) => (
          <div key={index} className="variant-box">
            <span className="pill">Variant {index + 1}</span>
            <div className="variant-grid">
              <input
                className="field"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => updateVariant(index, 'color', e.target.value)}
              />

              <input
                className="field"
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(index, 'size', e.target.value)}
              />

              <input
                className="field"
                placeholder="Material"
                value={variant.material}
                onChange={(e) => updateVariant(index, 'material', e.target.value)}
              />

              <input
                className="field"
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
              />
            </div>
          </div>
        ))}

        <div>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </section>
  );
}