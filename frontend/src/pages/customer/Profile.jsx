// src/pages/user/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Profile.css';

const cProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        rewards: 0
    });

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        axios.get('/api/users/profile', { withCredentials: true })
            .then(res => setProfile(res.data))
            .catch(err => console.error('Profile fetch failed', err));
    }, []);

    const handleChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        axios.put('/api/users/profile', profile, { withCredentials: true })
            .then(() => setEditMode(false))
            .catch(err => console.error('Profile update failed', err));
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <h2 className="profile-title">My Profile</h2>

                {/* ✅ 1. Basic Info */}
                <div className="profile-section">
                    <h3>Basic Information</h3>
                    <div className="profile-info">
                        <label>Name:</label>
                        {editMode ? (
                            <input name="name" value={profile.name} onChange={handleChange} />
                        ) : (
                            <p>{profile.name}</p>
                        )}
                    </div>
                    <div className="profile-info">
                        <label>Email:</label>
                        <p>{profile.email}</p>
                    </div>
                    <div className="profile-info">
                        <label>Mobile:</label>
                        {editMode ? (
                            <input name="mobile" value={profile.mobile} onChange={handleChange} />
                        ) : (
                            <p>{profile.mobile}</p>
                        )}
                    </div>
                    <div className="profile-info">
                        <label>Address:</label>
                        {editMode ? (
                            <textarea name="address" value={profile.address} onChange={handleChange} />
                        ) : (
                            <p>{profile.address || 'No address added yet.'}</p>
                        )}
                    </div>
                    {editMode ? (
                        <button className="save-btn" onClick={handleSave}>Save</button>
                    ) : (
                        <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Info</button>
                    )}
                </div>

                {/* ✅ 2. Account Actions */}
                <div className="profile-section">
                    <h3>Account Actions</h3>
                    <div className="action-buttons">
                        <button onClick={() => window.location.href = '/change-password'}>Change Password</button>
                        <button onClick={() => {
                            axios.post('/api/auth/logout', {}, { withCredentials: true })
                                .then(() => window.location.href = '/login');
                        }}>Logout</button>
                    </div>
                </div>

                {/* ✅ 4. Rewards / Loyalty */}
                <div className="profile-section">
                    <h3>Loyalty & Rewards</h3>
                    <p>Reward Points: <strong>{profile.rewards}</strong></p>
                    <p>Use points for discounts on your next order!</p>
                </div>
            </div>
            <Footer />  {/* ✅ Always at bottom */}
        </>
    );
};

export default cProfile;
