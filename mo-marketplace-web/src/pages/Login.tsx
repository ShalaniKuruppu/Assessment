import { useState } from 'react';
import { api } from '../api/client';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await api.post('/auth/login');

      //  Save token
      localStorage.setItem('token', res.data.access_token);

      alert('Login successful');

      navigate('/'); // go to home
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel auth-box">
      <div className="panel-body form-stack">
        <h2 className="headline">Sign In</h2>
        <p className="subtle">Authenticate once and manage products with full access.</p>

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <Link className="link-btn btn btn-secondary" to="/">
          Back to Product List
        </Link>
      </div>
    </section>
  );
}