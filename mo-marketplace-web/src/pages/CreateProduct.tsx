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
  const [errors, setErrors] = useState<string[]>([]);

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

  const validate = () => {
    const issues: string[] = [];

    if (!name.trim()) {
      issues.push('Product name is required.');
    }

    if (name.trim().length > 120) {
      issues.push('Product name must be 120 characters or less.');
    }

    if (!description.trim()) {
      issues.push('Description is required.');
    }

    if (description.trim().length > 400) {
      issues.push('Description must be 400 characters or less.');
    }

    if (variants.length === 0) {
      issues.push('Add at least one variant.');
    }

    const combinationSet = new Set<string>();

    variants.forEach((variant, index) => {
      const label = `Variant ${index + 1}`;

      if (!variant.color.trim()) {
        issues.push(`${label}: color is required.`);
      }

      if (!variant.size.trim()) {
        issues.push(`${label}: size is required.`);
      }

      if (!variant.material.trim()) {
        issues.push(`${label}: material is required.`);
      }

      if (!Number.isInteger(variant.stock) || variant.stock < 0 || variant.stock > 99999) {
        issues.push(`${label}: stock must be an integer between 0 and 99999.`);
      }

      const key = `${variant.color.trim().toLowerCase()}-${variant.size.trim().toLowerCase()}-${variant.material.trim().toLowerCase()}`;
      if (key !== '--') {
        if (combinationSet.has(key)) {
          issues.push(`${label}: duplicate variant combination in this form.`);
        }
        combinationSet.add(key);
      }
    });

    return issues;
  };

  const handleSubmit = async () => {
    const validationIssues = validate();
    setErrors(validationIssues);

    if (validationIssues.length > 0) {
      return;
    }

    try {
      await api.post('/products', {
        name: name.trim(),
        description: description.trim(),
        variants: variants.map((variant) => ({
          ...variant,
          color: variant.color.trim(),
          size: variant.size.trim(),
          material: variant.material.trim(),
        })),
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

        {errors.length > 0 && (
          <div className="error-summary" role="alert" aria-live="polite">
            <p>Please fix the following:</p>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <input
          className={`field ${!name.trim() && errors.length > 0 ? 'field-error' : ''}`}
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 120))}
          maxLength={120}
        />
        <p className="field-meta">{name.length}/120 characters</p>

        <input
          className={`field ${!description.trim() && errors.length > 0 ? 'field-error' : ''}`}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 400))}
          maxLength={400}
        />
        <p className="field-meta">{description.length}/400 characters</p>

        <div>
          <button className="btn btn-secondary" onClick={addVariant}>Add Variant</button>
        </div>

        {variants.map((variant, index) => (
          <div key={index} className="variant-box">
            <span className="pill">Variant {index + 1}</span>
            <div className="variant-grid">
              <input
                className={`field ${!variant.color.trim() && errors.length > 0 ? 'field-error' : ''}`}
                placeholder="Color"
                value={variant.color}
                onChange={(e) => updateVariant(index, 'color', e.target.value)}
              />

              <input
                className={`field ${!variant.size.trim() && errors.length > 0 ? 'field-error' : ''}`}
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(index, 'size', e.target.value)}
              />

              <input
                className={`field ${!variant.material.trim() && errors.length > 0 ? 'field-error' : ''}`}
                placeholder="Material"
                value={variant.material}
                onChange={(e) => updateVariant(index, 'material', e.target.value)}
              />

              <input
                className={`field ${(!Number.isInteger(variant.stock) || variant.stock < 0 || variant.stock > 99999) && errors.length > 0 ? 'field-error' : ''}`}
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                min={0}
                max={99999}
                step={1}
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