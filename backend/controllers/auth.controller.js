const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const AuthController = {
  // ✅ Send OTP to email
  sendOtp: async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    try {
      // Store or update OTP in otp_verification table
      const sqlInsertOtp = `
      INSERT INTO otp_verification (email, otp, attempts, expires_at)
      VALUES (?, ?, 0, ?)
      ON DUPLICATE KEY UPDATE otp = ?, attempts = 0, expires_at = ?
    `;
      db.query(sqlInsertOtp, [email, otp, expiresAt, otp, expiresAt], (err) => {
        if (err) {
          console.error('OTP DB error:', err);
          return res.status(500).json({ message: 'Failed to save OTP' });
        }
      });

      // Send OTP via email
      await sendEmail(
        email,
        'Email Verification OTP',
        `<p>Hi ${name},</p><p>Your OTP is: <strong>${otp}</strong></p><p>Please enter it to complete your registration. OTP valid for 5 minutes.</p>`
      );

      res.status(201).json({ message: 'OTP sent to email' });
    } catch (err) {
      console.error('Email send error:', err);
      res.status(500).json({ message: 'Failed to send OTP email' });
    }
  },

  // ✅ Verify OTP and register user
  verifyOtp: async (req, res) => {
    const { name, email, password, mobile, address, role, enteredOtp } = req.body;

    if (!name || !email || !password || !mobile || !address || !role || !enteredOtp) {
      return res.status(400).json({ message: 'All fields including OTP are required' });
    }

    try {
      // Check OTP from otp_verification table
      const [otpRows] = await db.promise().query(
        `SELECT otp, attempts, expires_at FROM otp_verification WHERE email = ?`,
        [email]
      );

      if (otpRows.length === 0) {
        return res.status(404).json({ message: 'OTP not found, please request again' });
      }

      const { otp, attempts, expires_at } = otpRows[0];
      const now = new Date();
      const expiresAt = new Date(expires_at); // convert DB value to Date

      if (now > expiresAt) {
        return res.status(400).json({ message: 'OTP expired, please request a new one' });
      }

      if (attempts >= 5) {
        return res.status(400).json({ message: 'Maximum OTP attempts reached' });
      }

      if (enteredOtp !== otp) {
        // Increment attempts
        await db.promise().query(`UPDATE otp_verification SET attempts = attempts + 1 WHERE email = ?`, [email]);
        return res.status(401).json({ message: 'Invalid OTP' });
      }

      // OTP is valid, hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Get role_id
      const [roleRows] = await db.promise().query(`SELECT id FROM roles WHERE name = ?`, [role]);
      if (roleRows.length === 0) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      const role_id = roleRows[0].id;

      // Insert user
      await db.promise().query(
        `INSERT INTO users (name, email, password, mobile, address, role_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, mobile, address, role_id]
      );

      // Delete OTP row
      await db.promise().query(`DELETE FROM otp_verification WHERE email = ?`, [email]);

      res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Verification error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },




  // ✅ Login
  login: (req, res) => {
    const { email, password, role } = req.body;

    if (!email?.trim() || !password?.trim() || !role?.trim()) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const sql = `
    SELECT u.id, u.name, u.email, u.password, u.address, r.name AS role 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE (u.email = ? OR u.mobile = ?) AND r.name = ?
  `;

    db.query(sql, [email.trim(), email.trim(), role.trim()], async (err, results) => {
      if (err) {
        console.error('Login DB error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email/mobile, password, or role' });
      }

      const user = results[0];
      try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
          { id: user.id, name: user.name, role: user.role, email: user.email, address: user.address },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        // ✅ Updated cookie settings for Render / cross-origin
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // true on HTTPS
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // cross-site safe in production
          maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
          message: 'Login successful',
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            address: user.address
          }
        });
      } catch (err) {
        console.error('Password error:', err);
        res.status(500).json({ message: 'Password verification failed' });
      }
    });
  },

  logout: (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  },


  getSessionUser: (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ user: decoded });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};

module.exports = AuthController;
