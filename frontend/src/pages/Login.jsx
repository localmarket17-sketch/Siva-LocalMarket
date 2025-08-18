import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './Login.css'; // Add this file to match Flipkart styling

const Login = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('/api/auth/session', { withCredentials: true });
        if (res.data?.user?.role) {
          const role = res.data.user.role;
          if (role === 'customer') {
            navigate('/');
          } else {
            navigate(`/${role}/dashboard`);
          }
        }
      } catch (err) { }
    };
    checkSession();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !role.trim()) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        '/api/auth/login',
        { email, password, role },
        { withCredentials: true }
      );

      const { user } = res.data;

      if (user?.role) {
        login(user);
        if (user.role === 'customer') {
          navigate('/');
        } else {
          navigate(`/${user.role}/dashboard`);
        }
      } else {
        setError('Login failed: Role missing');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page-wrapper">
      <Navbar />
      <div className="login-page">

        <div className="login-container">
          <div className="login-left">
            <h2>Login</h2>
            <p>
              Get access to your Orders,<br />
              Wishlist and Recommendations
            </p>
            <img
              src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg"
              alt="login"
            />
          </div>

          <form onSubmit={handleSubmit} className="login-right">
            <h3>Enter Email / Mobile number</h3>

            {error && <div className="error">{error}</div>}

            <input
              type="text"
              placeholder="Enter your email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
              <option value="delivery">Delivery Boy</option>
              <option value="customer">Customer</option>
            </select>

            <p className="terms">
              By continuing, you agree to our <span>Terms of Use</span> and <span>Privacy Policy</span>.
            </p>

            <button type="submit" className="otp-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="signup-link">
              New to the platform? <a href="/register">Create an account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
