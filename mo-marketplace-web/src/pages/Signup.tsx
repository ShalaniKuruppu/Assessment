import { useState } from 'react';
import { api } from '../api/client';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim()) {
      return 'Name is required.';
    }

    if (name.trim().length > 80) {
      return 'Name must be 80 characters or less.';
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return 'Email is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return 'Enter a valid email address.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (password.length > 72) {
      return 'Password must be 72 characters or less.';
    }

    return '';
  };

  const handleSignup = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/auth/signup', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      alert('Account created. Please sign in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Unable to sign up. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel auth-box">
      <div className="panel-body form-stack">
        <h2 className="headline">Sign Up</h2>
        <p className="subtle">Create your account to add and manage products.</p>

        {error ? (
          <div className="error-summary" role="alert" aria-live="polite">
            <p>{error}</p>
          </div>
        ) : null}

        <input
          className="field"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 80))}
          maxLength={80}
          autoComplete="name"
        />

        <input
          className="field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={160}
          autoComplete="email"
        />

        <input
          className="field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.slice(0, 72))}
          maxLength={72}
          autoComplete="new-password"
        />

        <button className="btn btn-primary" onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <Link className="link-btn btn btn-secondary" to="/login">
          Already have an account? Sign In
        </Link>

        <Link className="link-btn btn btn-secondary" to="/">
          Back to Product List
        </Link>
      </div>
    </section>
  );
}
