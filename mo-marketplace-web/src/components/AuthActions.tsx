import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function AuthActions() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="row">
      {isAuthenticated ? (
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" className="link-btn btn btn-secondary">Sign In</Link>
          <Link to="/signup" className="link-btn btn btn-secondary">Sign Up</Link>
        </>
      )}
      <Link to="/create" className="link-btn btn btn-primary">Create Product</Link>
    </div>
  );
}