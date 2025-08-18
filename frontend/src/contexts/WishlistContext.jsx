// src/contexts/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!user?.id) return;
        const res = await axios.get(`/api/wishlist/${user.id}`);
        setWishlist(res.data);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product) => {
    try {
      if (!user?.id) return;
      await axios.post('/api/wishlist', { userId: user.id, productId: product.id });
      setWishlist((prev) => [...prev, product]);
    } catch (err) {
      console.error('Add to wishlist failed:', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (!user?.id) return;
      await axios.delete(`/api/wishlist/${user.id}/${productId}`);
      setWishlist((prev) => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Remove from wishlist failed:', err);
    }
  };

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
