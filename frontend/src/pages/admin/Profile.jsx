import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './Profile.css';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get('/api/admin/profile', { withCredentials: true });
      setAdmin(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        mobile: res.data.mobile || '',
        address: res.data.address || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setMessage('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put('/api/admin/profile', formData, { withCredentials: true });
      setAdmin({ ...admin, ...formData });
      setEditing(false);
      setMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Update failed. Try again.');
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

        {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Mobile:</strong> {admin.mobile}</p>
            <p><strong>Address:</strong> {admin.address || '-'}</p>
            <p><strong>Role:</strong> {admin.role || 'Admin'}</p>

            <button onClick={() => setEditing(true)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, name, type = 'text', ...rest }) => (
  <div>
    <label className="block font-semibold">{label}:</label>
    <input
      type={type}
      name={name}
      className="w-full border p-2 rounded"
      {...rest}
    />
  </div>
);

export default Profile;
