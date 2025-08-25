import React, { useContext, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { SearchContext } from '../contexts/SearchContext';
import { AuthContext } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { setSearchQuery } = useContext(SearchContext);
  const { cartItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState('Fetching...');
  const [showDelivery] = useState(true);
  const navigate = useNavigate();

  // Fetch location
  useEffect(() => {
    if (user && user.address) {
      setLocation(user.address);
    } else {
      setLocation('Unknown');
    }
  }, [user]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
