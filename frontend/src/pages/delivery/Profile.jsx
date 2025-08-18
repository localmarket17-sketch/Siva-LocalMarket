// src/pages/deliveryboy/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import './Profile.css';

const Profiles = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/delivery/profile', { withCredentials: true });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put('/api/delivery/profile', profile, { withCredentials: true });
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebarvd role="delivery" />
      <div className="deliveryboy-page">
        <h2>Profile</h2>
        <div className="profile-form">
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleChange} />

          <label>Email</label>
          <input name="email" value={profile.email} onChange={handleChange} />

          <label>mobile</label>
          <input name="mobile" value={profile.mobile} onChange={handleChange} />

          <button onClick={handleUpdate}>Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
