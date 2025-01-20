const User = require('../model/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, role, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        role,
        firstName,
        lastName
      });

      // Generate token
      const token = signToken(user._id);

      res.status(201).json({
        status: 'success',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName:user.firstName,
          lastName:user.lastName

        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email and password exist
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      // Check if user exists && password is correct
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      // Generate token
      const token = signToken(user._id);

      res.status(200).json({
        status: 'success',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;