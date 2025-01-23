const User = require('../models/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const authController = {
  register: async (req, res) => {
    try {
      const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || 'HR'
      });

      // Create token
      const token = signToken(newUser._id);

      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
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
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      const isPasswordCorrect = await user.correctPassword(password);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      // Send token
      const token = signToken(user._id);
      
      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;