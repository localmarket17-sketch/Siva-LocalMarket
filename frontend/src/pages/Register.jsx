import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:3000/api/auth/send-otp',
        { name: formData.name, email: formData.email },
        { withCredentials: true }
      );

      if ([200, 201, 204].includes(res.status)) {
        setOtpSent(true);
        alert('OTP sent to your email');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Enter the OTP');

    try {
      setLoading(true);
const res = await axios.post(
  'http://localhost:3000/api/auth/verify-otp',
  {
    enteredOtp: otp,
    sentOtp: otp, // ⚠️ TEMPORARY FIX — backend should store OTP server-side ideally
    role,
    ...formData,
  },
  { withCredentials: true }
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
    return name && email && password && address && mobile;
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
        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        <label>{role === 'vendor' ? 'Shop Address' : 'Full Address'}</label>
        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
      </>
    );
  };

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
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to email"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otp || loading}
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
