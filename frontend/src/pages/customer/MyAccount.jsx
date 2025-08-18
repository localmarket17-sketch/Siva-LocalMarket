import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/session'); // token in cookie
        setUser(res.data.user);
      } catch (err) {
        console.warn("User not logged in, redirecting to login...");
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout'); // optional, if logout clears cookie on server
    } catch (err) {
      console.error('Logout failed:', err);
    }
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  if (!user) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="myaccount-container">
        <h2 className="myaccount-title">My Profile</h2>

        <div className="myaccount-section">
          <span className="edit-profile" onClick={() => navigate('/profile')}>Edit</span>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="myaccount-separator"></div>

        <div className="myaccount-actions">
          <button onClick={() => navigate('/myorders')}>My Orders</button>
          <button onClick={() => navigate('/wishlist')}>Wishlist</button>
          <button disabled>Settings (Coming Soon)</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyAccount;
