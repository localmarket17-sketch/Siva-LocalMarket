// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check session when app loads
  useEffect(() => {
    axios
      .get('/api/auth/session', { withCredentials: true })
      .then(res => {
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      })
      .catch(err => {
        // Suppress expected 401 error silently
        if (err.response?.status !== 401) {
          console.error('🔴 Session check failed:', err);
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Called after login success
  const login = (user) => {
    setUser(user);
  };

  // Logout and clear session
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login'); // ✅ Redirect to login page
    } catch (err) {
      console.error('🔴 Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
