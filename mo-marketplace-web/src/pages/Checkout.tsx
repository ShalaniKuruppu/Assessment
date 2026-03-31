import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface QuickBuyPayload {
  productId: number;
  productName: string;
  color: string;
  size: string;
  material: string;
}

interface CheckoutState {
  source?: 'quick-buy' | 'cart';
  quickBuyItem?: QuickBuyPayload;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as CheckoutState | null) ?? null;

  const quickBuyItem = state?.source === 'quick-buy' ? state.quickBuyItem : undefined;
  const checkoutItems = useMemo(() => {
    if (quickBuyItem) {
      return 1;
    }

    try {
      const rawCart = localStorage.getItem('cart_items');
      if (!rawCart) {
        return 0;
      }

      const cart = JSON.parse(rawCart) as Array<{ quantity?: number }>;
      return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    } catch {
      return 0;
    }
  }, [quickBuyItem]);

  const unitPrice = 49;
  const subtotal = checkoutItems * unitPrice;
  const shippingFee = checkoutItems > 0 ? 7 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shippingFee + tax;

  const handleReturn = () => {
    if (quickBuyItem) {
      navigate(`/products/${quickBuyItem.productId}`);
      return;
    }

    navigate('/cart');
  };

  return (
    <section className="panel">
      <div className="panel-body form-stack">
        <h2 className="headline">Checkout</h2>
        <span className="pill">Items in this checkout: {checkoutItems}</span>

        {quickBuyItem ? (
          <article className="product-card">
            <h3 className="headline">Quick Buy Item</h3>
            <p className="subtle">{quickBuyItem.productName}</p>
            <span className="pill">
              {quickBuyItem.color} / {quickBuyItem.size} / {quickBuyItem.material}
            </span>
          </article>
        ) : (
          <p className="subtle">Cart checkout flow reached successfully.</p>
        )}

        <article className="product-card">
          <h3 className="headline">Delivery Details</h3>
          <p className="subtle">These fields are placeholders for now.</p>
          <div className="select-grid">
            <input className="field" value="John Doe" readOnly aria-label="Full name" />
            <input className="field" value="john.doe@example.com" readOnly aria-label="Email" />
            <input className="field" value="+1 555 100 200" readOnly aria-label="Phone" />
          </div>
          <input className="field" value="221B Baker Street, London" readOnly aria-label="Address" />
          <div className="select-grid">
            <input className="field" value="London" readOnly aria-label="City" />
            <input className="field" value="NW1 6XE" readOnly aria-label="Postal code" />
          </div>
        </article>

        <article className="product-card">
          <h3 className="headline">Payment Method</h3>
          <p className="subtle">payment options shown for UI demonstration.</p>
          <div className="action-group">
            <span className="pill">Card ending in 4242</span>
            <span className="pill">UPI</span>
            <span className="pill">Cash on Delivery</span>
          </div>
        </article>

        <article className="product-card">
          <h3 className="headline">Order Summary</h3>
          <p className="subtle">Subtotal: ${subtotal}</p>
          <p className="subtle">Shipping: ${shippingFee}</p>
          <p className="subtle">Tax: ${tax}</p>
          <span className="pill">Total Payable: ${total}</span>
        </article>

        <article className="product-card">
          <h3 className="headline">Before You Place Order</h3>
          <p className="subtle">Orders are processed within 24 hours.</p>
          <p className="subtle">Returns accepted within 7 days of delivery.</p>
          <p className="subtle">Support: support@momarketplace.local</p>
        </article>

        <div className="action-group">
          <button type="button" className="btn btn-primary" disabled={checkoutItems === 0}>
            Place Order
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReturn}>
            Go Back
          </button>
          <Link className="link-btn btn btn-secondary" to="/cart">
            View Cart
          </Link>
        </div>
      </div>
    </section>
  );
}
