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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Optional: store OTP in DB with temporary user/email
      const tempUserId = Date.now(); // simple example (replace with DB logic)

      await sendEmail(
        email,
        'Email Verification OTP',
        `<p>Hi ${name},</p><p>Your OTP is: <strong>${otp}</strong></p><p>Please enter it to complete your registration.</p>`
      );

      // Return 201 with userId
      res.status(201).json({ message: 'OTP sent to email', userId: tempUserId });
    } catch (err) {
      console.error('Email send error:', err);
      res.status(500).json({ message: 'Failed to send OTP email' });
    }
  },

  // ✅ Register user after OTP is verified on frontend
  verifyOtp: async (req, res) => {
    const {
      name,
      email,
      password,
      mobile,
      address,
      role,
      enteredOtp,
      sentOtp
    } = req.body;

    if (
      !name || !email || !password || !mobile || !address || !role ||
      !enteredOtp || !sentOtp
    ) {
      return res.status(400).json({ message: 'All fields including OTPs are required' });
    }

    if (enteredOtp !== sentOtp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const roleQuery = 'SELECT id FROM roles WHERE name = ?';
      db.query(roleQuery, [role], (err, result) => {
        if (err || result.length === 0) {
          return res.status(400).json({ message: 'Invalid role', error: err });
        }

        const role_id = result[0].id;

        const sql = `
        INSERT INTO users (name, email, password, mobile, address, role_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

        db.query(
          sql,
          [name, email, hashedPassword, mobile, address || null, role_id],
          (err, result) => {
            if (err) {
              console.error('Registration error:', err);
              return res.status(500).json({ message: 'Registration failed' });
            }

            return res.status(200).json({ message: 'User registered and OTP verified successfully' });
          }
        );
      });
    } catch (err) {
      console.error('Hashing error:', err);
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
          { id: user.id, name: user.name, role: user.role, email: user.email, address: user.address},
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
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
      sameSite: 'Lax'
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
