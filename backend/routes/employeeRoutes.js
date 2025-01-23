const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middleware/auth');

// Protected routes - only authenticated HR can access
router.post('/employees', protect, restrictTo('HR'), employeeController.createEmployee);
router.get('/employees', protect, employeeController.getAllEmployees);
router.get('/employees/:id', protect, employeeController.getEmployeeById);
router.patch('/employees/:id/onboarding', protect, restrictTo('HR'), employeeController.updateOnboardingStatus);

module.exports = router;