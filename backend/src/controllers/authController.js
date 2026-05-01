const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockUserService = require('../services/mockUserService');

let useMongoDb = true;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    try {
      // Try MongoDB first
      const existingUser = await User.findOne({ email: trimmedEmail });
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name.trim(),
        email: trimmedEmail,
        password: hashedPassword,
        role,
      });

      const token = generateToken(user._id);
      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (dbError) {
      // Fallback to mock service
      console.log('MongoDB unavailable, using fallback auth');
      useMongoDb = false;

      const existingUser = await mockUserService.userExists(trimmedEmail);
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await mockUserService.createUser({
        name: name.trim(),
        email: trimmedEmail,
        password: hashedPassword,
        role,
      });

      const token = generateToken(user.id);
      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Unable to create user.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    try {
      // Try MongoDB first
      const user = await User.findOne({ email: trimmedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = generateToken(user._id);
      res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (dbError) {
      // Fallback to mock service
      console.log('MongoDB unavailable, using fallback auth');
      useMongoDb = false;

      const user = await mockUserService.findUserByEmail(trimmedEmail);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = generateToken(user.id);
      res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Unable to login.' });
  }
};
