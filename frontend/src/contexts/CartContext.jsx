// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // ✅ Import auth context

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth(); // ✅ Get current user

  // ✅ Only load cart if logged-in user is a customer
  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart/user/cart', {
        withCredentials: true,
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const addToCart = async (item) => {
    try {
      await axios.post(
        '/api/cart/user/cart',
        {
          productId: item.id,
          quantity: 1,
        },
        { withCredentials: true }
      );
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await axios.put(
        `/api/cart/user/cart/${itemId}`,
        { quantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/api/cart/user/cart/${itemId}`, {
        withCredentials: true,
      });
      fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const getCartQty = (productId) => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartQty }}
    >
      {children}
    </CartContext.Provider>
  );
};
