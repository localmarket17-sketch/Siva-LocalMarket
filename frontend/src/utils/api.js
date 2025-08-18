import axios from 'axios';

// ✅ Base Axios instance
const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // 🔐 Send cookies automatically
});

// ❌ REMOVE interceptor that attaches Authorization header
// Since we're using HttpOnly cookies, we don't need to send Bearer tokens manually

// ============================
// 🛒 Cart APIs
// ============================

export const getCartItems = () => API.get('/user/cart');
export const updateCartItemQuantity = (itemId, quantity) =>
  API.put(`/user/cart/${itemId}`, { quantity });
export const deleteCartItem = (itemId) => API.delete(`/user/cart/${itemId}`);

// ============================
// 🛍️ Product APIs
// ============================

export const getAllProducts = () => API.get('/product');

// ============================
// 🧾 Order APIs
// ============================

export const placeOrder = (orderData) => API.post('/order/place', orderData);
export const getUserOrders = () => API.get('/order/my-orders');

// ============================
// 👤 Auth APIs
// ============================

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// ============================
// 📬 Notification APIs
// ============================

export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}/read`);

export default API;
