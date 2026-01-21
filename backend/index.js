require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('./config/passport')(passport);
const app = express();
connectDB();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/register', require('./routes/registerRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));