import { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '20px' }}>
      <h1>Create Product</h1>

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={addVariant}>Add Variant</button>

      <br /><br />

      {variants.map((v, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Color"
            value={v.color}
            onChange={(e) =>
              updateVariant(index, 'color', e.target.value)
            }
          />

          <input
            placeholder="Size"
            value={v.size}
            onChange={(e) =>
              updateVariant(index, 'size', e.target.value)
            }
          />

          <input
            placeholder="Material"
            value={v.material}
            onChange={(e) =>
              updateVariant(index, 'material', e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Stock"
            value={v.stock}
            onChange={(e) =>
              updateVariant(index, 'stock', Number(e.target.value))
            }
          />
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}