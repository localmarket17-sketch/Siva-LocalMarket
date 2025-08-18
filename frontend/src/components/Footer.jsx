// src/components/Footer.jsx
import React, { useEffect, useState } from 'react';
import './Footer.css';
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Home,
  List,
  ShoppingCart,
  Percent,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const [showAll, setShowAll] = useState(false);
  const hideOnPaths = ['/payment', '/product/'];

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/brands'),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Error loading footer data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isMobile ? (
        !hideOnPaths.some(path => location.pathname.startsWith(path)) && (
          <div className="mobile-footer-nav">
            <Link to="/" className="footer-nav-item">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/categories" className="footer-nav-item">
              <List size={20} />
              <span>Categories</span>
            </Link>
            <Link to="/cart" className="footer-nav-item">
              <ShoppingCart size={20} />
              <span>Cart</span>
            </Link>
            <Link to="/account" className="footer-nav-item">
              <User size={20} />
              <span>My Account</span>
            </Link>
          </div>
        )
      ) : (
        <footer className="footer desktop-footer">
          <div className="footer-columns">
            <div className="footer-col">
              <h4>All Categories</h4>
              <ul>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>All Brands</h4>
              <ul>
                {(showAll ? brands : brands.slice(0, 10)).map((brand) => (
                  <li key={brand.id}>
                    <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                  </li>
                ))}

                {brands.length > 10 && (
                  <li>
                    <button
                      onClick={() => setShowAll(!showAll)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {showAll ? "show less" : "...more"}
                    </button>
                  </li>
                )}
              </ul>

            </div>

            <div className="footer-col">
              <h4>Help</h4>
              <ul>
                <li>Payments</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Us</h4>
              <p>
                LocalMarket Internet Pvt. Ltd.<br />
                123 Market Street,<br />
                Bengaluru, 560103,<br />
                Karnataka, India
              </p>

              <h4>Social</h4>
              <div className="social-icons">
                <Facebook size={20} />
                <Twitter size={20} />
                <Youtube size={20} />
                <Instagram size={20} />
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-links">
              <span>🛒 Become a Seller</span>
              <span>📢 Advertise</span>
              <span>🎁 Gift Cards</span>
              <span>❓ Help Center</span>
            </div>
            <div className="footer-right">© 2025 LocalMarket.com</div>
          </div>
        </footer>
      )}
    </>
  );

};

export default Footer;
