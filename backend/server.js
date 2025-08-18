const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

// Trust proxy if behind HTTPS (e.g., in production)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',  // Frontend URL
  credentials: true                // 🔐 Allow cookies
}));

app.use(express.json());
app.use(cookieParser());            // 🔐 Parse cookies
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // for product images

// Test Route
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Database connection
const db = require('./models/db');


// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/vendor', require('./routes/vendor.routes'));
app.use('/api/delivery', require('./routes/delivery.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/subcategories', require('./routes/subcategories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/upload', require('./routes/uploads'));




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
