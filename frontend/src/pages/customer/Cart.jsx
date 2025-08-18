import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartEmptyImg from '../../assets/cart-empty.jpg';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated: isLoggedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems(cartItems.map((item) => item.id));
  }, [cartItems]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const increaseQty = (id, currentQty) => {
    updateQuantity(id, currentQty + 1);
  };

  const decreaseQty = (id, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const total = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="auth-error-box">
          <img src={CartEmptyImg} alt="Empty Cart" className="auth-error-image" />
          <h3 className="auth-error-title">Your cart is empty.</h3>
          <p className="auth-error-subtitle">Add items to your cart to see them here</p>

          {!isLoggedIn && (
            <p className="auth-error-hint">
              Missing cart items?{' '}
              <span onClick={() => navigate('/login')} className="login-link">
                Login here
              </span>
            </p>
          )}

          {isLoggedIn && (
            <button className="explore-btn" onClick={() => navigate('/')}>← Start Shopping</button>
          )}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-layout">
        <div className="cart-inner-wrapper">
          <div className="cart-heading-row">
            <h2 className="cart-heading">Your Cart Items</h2>
            <span className="explore-link" onClick={() => navigate('/')}>Explore More</span>
          </div>

          <div className={`cart-content ${isMobile ? 'mobile' : 'desktop'}`}>
            <div className="cart-items-grid">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <img src={item.image || 'https://via.placeholder.com/60'} alt={item.title} />
                  <div className="details">
                    <h4>{item.title}</h4>
                    <div className="info-pair">
                      <p>₹{item.price}</p>
                      <div className="qty-controls" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => decreaseQty(item.id, item.quantity)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id, item.quantity)}>+</button>
                      </div>
                    </div>
                    <div className="info-pair">
                      <p>Total: ₹{item.price * item.quantity}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="delete-btn"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isMobile && (
              <div className="cart-summary-box">
                <h3>Total: ₹{total}</h3>
                <button
                  className="checkout-btn"
                  onClick={() => navigate('/checkout')}
                  disabled={selectedItems.length === 0}
                >
                  Continue to Checkout →
                </button>
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <div className="mobile-sticky-footer">
            <button
              className="pay-btn"
              onClick={() => navigate('/checkout')}
              disabled={selectedItems.length === 0}
            >
              Pay Now ₹{total}
            </button>
            <button className="explore-btn" onClick={() => navigate('/')}>Explore More</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
