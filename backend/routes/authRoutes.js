const express = require('express');
const router = express.Router();
const authController = require('../controller/authController.js');
const { protect, restrictTo } = require('../middleware/auth.js');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;