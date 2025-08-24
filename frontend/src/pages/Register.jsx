import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';
import './Register.css';

const Register = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    shopName: '',
    name: '',
    email: '',
    password: '',
    address: '',
    mobile: '',
  });
  const [otp, setOtp] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      // allow only numbers and max 10 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add this function before the handlers
  const startOtpTimer = () => {
    if (intervalId) clearInterval(intervalId); 
    setOtpTimer(300); // 5 minutes
    setCanResend(false);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(interval);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(
        '/auth/send-otp',
        { name: formData.name, email: formData.email },
        { withCredentials: true }
      );

      if ([200, 201, 204].includes(res.status)) {
        setOtpSent(true);
        startOtpTimer(); // start OTP countdown
        alert("OTP sent to your email");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      const res = await API.post(
        '/auth/send-otp',
        { name: formData.name, email: formData.email },
        { withCredentials: true }
      );

      if ([200, 201, 204].includes(res.status)) {
        startOtpTimer(); // restart OTP countdown
        alert('OTP resent to your email');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      alert(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };



  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Enter the OTP');

    try {
      setLoading(true);
      console.log({ enteredOtp: otp, role, ...formData });
      const res = await API.post(
        '/auth/verify-otp',
        {
          enteredOtp: otp, // ⚠️ TEMPORARY FIX — backend should store OTP server-side ideally
          role,
          ...formData,
        },
        { withCredentials: true } // explicitly send cookies
      );

      if (res.status === 200) {
        alert('OTP verified successfully. You can now login.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      alert(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = () => {
    const { shopName, name, email, password, address, mobile } = formData;
    if (!role) return false;
    if (role === 'vendor' && !shopName) return false;
    return name && email && password && address && mobile.length === 10;
  };

  const renderFields = () => {
    if (!role || otpSent) return null;
    return (
      <>
        {role === 'vendor' && (
          <>
            <label>Shop Name</label>
            <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} />
          </>
        )}
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        <label>Mobile No.</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          maxLength="10"
          placeholder="Enter 10-digit mobile"
        />
        <label>{role === 'vendor' ? 'Shop Address' : 'Full Address'}</label>
        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
      </>
    );
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-left">
          <h2>Register</h2>
          <p>Create an account to track orders, save wishlist, and more.</p>
          <img
            src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg"
            alt="Register"
          />
        </div>

        <div className="register-right">
          <form className="register-form">
            <h3>Fill the Details Below</h3>

            <label>Select Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">-- Select Role --</option>
              <option value="vendor">Vendor</option>
              <option value="delivery">Delivery Boy</option>
              <option value="customer">Customer</option>
            </select>

            {renderFields()}

            {!otpSent && role && (
              <button type="button" onClick={handleSendOtp} disabled={!isFormFilled() || loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            )}

            {otpSent && (
              <div className="otp-section">
                <h4>Entered Details</h4>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Mobile:</strong> {formData.mobile}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                {role === 'vendor' && <p><strong>Shop Name:</strong> {formData.shopName}</p>}

                <label>Enter OTP</label>
                <p>OTP expires in: {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</p>
                {otpTimer === 0 && (
                  <p>
                    OTP expired.{' '}
                    <button type="button" onClick={handleResendOtp} className="resend-link">
                      Resend OTP
                    </button>
                  </p>
                )}
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // only numbers, max 6 digits
                  placeholder="Enter the OTP sent to email"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otp || loading || otpTimer === 0}
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                </button>
              </div>
            )}

            <p className="form-footer">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
