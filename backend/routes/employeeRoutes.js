const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');

router.post('/employees', employeeController.createEmployee);
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);
router.patch('/employees/:id/onboarding', employeeController.updateOnboardingStatus);

module.exports = router;