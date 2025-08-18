import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCode } from 'react-qrcode-logo';
import { useCart } from '../../contexts/CartContext';
import './Checkout.css';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [editAddressMode, setEditAddressMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { removeFromCart } = useCart();

  useEffect(() => {
    axios.get('/api/users/profile').then(res => setAddress(res.data.address || ''));
    axios.get('/api/users/cart').then(res => setCartItems(res.data));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        items: cartItems.map(item => ({
          product_id: item.product_id || item.id, // ensure correct field name
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        payment_mode: paymentMethod
      };

      console.log("Order Payload:", payload);

      await axios.post('/api/orders/create', payload, {
        withCredentials: true
      });

      for (const item of cartItems) {
        await removeFromCart(item.id);
      }

      alert('Order placed successfully!');
      window.location.href = '/';
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert('Error placing order.');
    }
  };


  return (
    <>
      <div className="checkout-layout">
        <div className="checkout-side"></div>

        <div className="checkout-main">

          <h2 className="checkout-title">Checkout</h2>

          {/* Address */}
          <div className="checkout-card">
            <h3 className="section-title">Shipping Address</h3>
            {!editAddressMode ? (
              <>
                <p className="address-display">{address || 'No address added yet.'}</p>
                <button className="edit-btn" onClick={() => setEditAddressMode(true)}>
                  {address ? 'Edit Address' : 'Add Address'}
                </button>
              </>
            ) : (
              <>
                <textarea
                  rows="3"
                  className="address-input"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your address..."
                />
                <button className="save-btn" onClick={() => setEditAddressMode(false)}>
                  Save Address
                </button>
              </>
            )}
          </div>

          {/* Payment */}
          <div className="checkout-card">
            <h3 className="section-title">Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>Cash on Delivery</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                />
                <span>UPI</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <span>Card</span>
              </label>
            </div>

            {/* Card Input */}
            {paymentMethod === 'card' && (
              <div className="card-details">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  value={cardDetails.expiry}
                  onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
              </div>
            )}

            {/* UPI QR */}
            {paymentMethod === 'upi' && (
              <div className="upi-section">
                <p>Scan the QR code with your UPI app to pay:</p>
                <QRCode
                  value={`upi://pay?pa=annapurna8054@oksbi&pn=KANDREGULA%20MANOJ%20KRISHNA&am=${total}&cu=INR`}
                  size={160}
                />
                <p className="upi-id">UPI ID: annapurna8054@oksbi</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="checkout-card">
            <h3 className="section-title">Order Summary</h3>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.title} (₹{item.price} × {item.quantity})</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Desktop Place Order Button */}
          {!isMobile && (
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          )}
        </div>

        <div className="checkout-side"></div>
      </div>

      {/* Sticky button on mobile */}
      {isMobile && (
        <div className="mobile-sticky-footer">
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}
    </>
  );
};

export default Checkout;
