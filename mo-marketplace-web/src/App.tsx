import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand-wrap">
            <span className="brand-kicker">MO Marketplace</span>
            <h1 className="brand-title">New Product Experience</h1>
          </div>
        </header>

        <main className="page-wrap">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<CreateProduct />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;