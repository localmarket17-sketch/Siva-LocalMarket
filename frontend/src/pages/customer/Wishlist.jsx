// src/pages/customer/Wishlist.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from "../../contexts/CartContext";  
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Wishlist.css';
import RImg from '../../assets/R.png'; // fallback image if needed

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart, fetchCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`/api/wishlist/${user.id}`);
      setWishlist(res.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${user.id}/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const moveToCart = async (product) => {
    try {
      await axios.post(
        "/api/cart/user/cart", // ✅ correct endpoint
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // ✅ needed for req.user
          },
        }
      );
      if (typeof fetchCart === "function") {
        await fetchCart();
      }
      await removeFromWishlist(product.id);
    } catch (err) {
      console.error(
        "Error moving item to cart:",
        err.response?.data || err.message
      );
    }
  };



  useEffect(() => {
    if (user?.id) fetchWishlist();
  }, [user]);

  return (
    <div className="wishlist-page bg-white min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-6 flex-grow">
        <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>

        {loading ? (
          <p>Loading...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-card-img-wrapper">
                  <img
                    src={item.image_url || RImg}
                    alt={item.title}
                    className="wishlist-card-img"
                    onError={(e) => (e.target.src = RImg)}
                  />
                </div>
                <div className="wishlist-card-details">
                  <h3 className="wishlist-card-title">{item.title}</h3>
                  <p className="wishlist-card-price">₹{item.price}</p>
                  <div className="wishlist-card-actions">
                    <button onClick={() => moveToCart(item)} className="btn-cart">
                      Add to Cart
                    </button>
                    <button onClick={() => removeFromWishlist(item.id)} className="btn-remove">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}


          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
