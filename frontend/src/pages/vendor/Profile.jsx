import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/vendor/profile', { withCredentials: true });
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/vendor/profile', formData, { withCredentials: true });
      setEditOpen(false);
      fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="vendor-profile-layout">
      <Sidebarvd role="vendor" />
      <div className="vendor-profile-container">
        <h2 className="page-heading">👤 Vendor Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <>
            <div className="profile-details">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.mobile}</p>
              <p><strong>Shop Name:</strong> {profile.shop_name}</p>
              <button className="edit-btn" onClick={() => setEditOpen(true)}>✏️ Edit</button>
            </div>

            {editOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Edit Profile</h3>
                  <form onSubmit={handleSubmit} className="profile-form">
                    <label>
                      Name
                      <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                    </label>
                    <label>
                      Email
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                    </label>
                    <label>
                      Phone
                      <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
                    </label>
                    <label>
                      Shop Name
                      <input type="text" name="shop_name" value={formData.shop_name || ''} onChange={handleChange} />
                    </label>
                    <div className="form-actions">
                      <button type="submit" className="save-btn">Save</button>
                      <button type="button" onClick={() => setEditOpen(false)} className="cancel-btn">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <p>No profile found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
