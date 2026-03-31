import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../store/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setName(res.data.name ?? '');
        setDescription(res.data.description ?? '');
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load product details.');
      });
  }, [id]);

  const handleSave = async () => {
    if (!id) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setError('Name and description are required.');
      return;
    }

    if (trimmedName.length > 120) {
      setError('Name must be 120 characters or less.');
      return;
    }

    if (trimmedDescription.length > 400) {
      setError('Description must be 400 characters or less.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.patch(`/products/${id}`, {
        name: trimmedName,
        description: trimmedDescription,
      });

      alert('Product features updated.');
      navigate(`/products/${id}`);
    } catch (err) {
      console.error(err);
      setError('Update failed. Admin access is required.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <section className="panel auth-box">
        <div className="panel-body form-stack">
          <h2 className="headline">Admin Access Required</h2>
          <p className="subtle">Please sign in with an admin account to edit product features.</p>
          <Link className="link-btn btn btn-secondary" to="/login">Sign In</Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="panel">
        <div className="panel-body">
          <p className="subtle">Loading product...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel auth-box">
      <div className="panel-body form-stack">
        <h2 className="headline">Edit Product Features</h2>
        <p className="subtle">Update product name and description as admin.</p>

        {error ? (
          <div className="error-summary" role="alert" aria-live="polite">
            <p>{error}</p>
          </div>
        ) : null}

        <input
          className="field"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 120))}
          maxLength={120}
        />

        <input
          className="field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 400))}
          maxLength={400}
        />

        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <Link className="link-btn btn btn-secondary" to={`/products/${product.id}`}>
          Back to Product Detail
        </Link>
      </div>
    </section>
  );
}
