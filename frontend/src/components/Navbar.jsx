import React, { useContext, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { AuthContext } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState('Fetching...');
  const [showDelivery, setShowDelivery] = useState(true);
  const navigate = useNavigate();

  // Fetch location
  useEffect(() => {
    if (user && user.address) {
      setLocation(user.address);
    } else {
      setLocation('Unknown');
    }
  }, [user]);

  // Hide delivery bar on scroll
  useEffect(() => {
    let lastScroll = window.scrollY;
    let scrollingDown = false;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll + 5) { // scrolling down
        if (!scrollingDown) {
          setShowDelivery(false);
          scrollingDown = true;
        }
      } else if (currentScroll < lastScroll - 5) { // scrolling up
        if (scrollingDown) {
          setShowDelivery(true);
          scrollingDown = false;
        }
      } else if (currentScroll < 50) { // near top
        setShowDelivery(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (onSearch) onSearch(e.target.value);
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-wrapper">
      {/* Top Navbar */}
      <div className="navbar-top">
        <div className="logo">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>🛒 LocalMarket</a>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍  Search In LocalMarket"
            onChange={handleSearch}
            className="search-bar"
          />
        </div>

        <div className="navbar-icons">
          <div className="home">
            <Link to="/" className="cart-link">
              Home
            </Link>
          </div>
          <div className="cart">
            <Link to="/cart" className="cart-link">
              {user ? (
                <>
                  🛒<span className="cart-count">{cartItems.length}</span>
                </>
              ) : (
                <>
                  🛒 Cart<span className="cart-count">{cartItems.length}</span>
                </>
              )}
            </Link>
          </div>
          <div className="auth">
            {user ? (
              <div className="user-dropdown-toggle" onClick={toggleDropdown}>
                {user.image ? (
                  <img src={user.image} alt="User" className="user-image" />
                ) : (
                  user.name
                )}
                ⏷
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <Link to="/myorders">My Orders</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="signin-btn">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Bar */}
      {showDelivery && (
        <div className="delivery-bar">
          {user ? (
            <>Scheduled delivery to: <strong>{location}</strong></>
          ) : (
            <>🔒 Please login to set your delivery address</>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
