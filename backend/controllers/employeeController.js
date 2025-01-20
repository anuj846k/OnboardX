const Employee = require('../models/employee');

const employeeController = {
  // Create new employee
  createEmployee: async (req, res) => {
    try {
      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all employees
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.find()
        .select('-__v')
        .sort({ createdAt: -1 });
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get employee by ID
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update onboarding status
  updateOnboardingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, documentUpdates } = req.body;
      
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      if (status) {
        employee.onboardingStatus.status = status;
      }

      if (documentUpdates) {
        // Update specific document statuses
        documentUpdates.forEach(update => {
          const doc = employee.onboardingStatus.documents.find(
            d => d.documentType === update.documentType
          );
          if (doc) {
            Object.assign(doc, update);
          }
        });
      }

      await employee.save();
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = employeeController;