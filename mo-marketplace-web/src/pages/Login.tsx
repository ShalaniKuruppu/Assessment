import { useState } from 'react';
import { api } from '../api/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  const notice = (location.state as { notice?: string } | null)?.notice ?? '';

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: normalizedEmail,
        password,
      });

      signIn(res.data.access_token, res.data.user ?? null);

      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      setError('Login failed. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel auth-box">
      <div className="panel-body form-stack">
        <h2 className="headline">Sign In</h2>
        <p className="subtle">Authenticate once and manage products with full access.</p>
        {redirectPath !== '/' ? (
          <p className="subtle">Sign in to continue where you left off.</p>
        ) : null}

        {notice ? <span className="status status-ok">{notice}</span> : null}

        {error ? (
          <div className="error-summary" role="alert" aria-live="polite">
            <p>{error}</p>
          </div>
        ) : null}

        <input
          className="field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          maxLength={160}
        />

        <input
          className="field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          maxLength={72}
        />

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <Link className="link-btn btn btn-secondary" to="/signup">
          Create an Account
        </Link>

        <Link className="link-btn btn btn-secondary" to="/">
          Back to Product List
        </Link>
      </div>
    </section>
  );
}