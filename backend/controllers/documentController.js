const DocumentTemplate = require("../models/documentTemplate");
const Employee = require("../models/employee");

const documentController = {
  addDocumentTemplate: async (req, res) => {
    try {
      const template = new DocumentTemplate(req.body);
      await template.save();
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllTemplates: async (req, res) => {
    try {
      const templates = await DocumentTemplate.find();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  assignDocumentToEmployees: async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { documents } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employeeId) {
        return res.status(404).json({ message: "Employee not found" });
      }

      documents.forEach((doc) => {
        employee.onboardingStatus.documents.push({
          documentType: doc.type,
          status: "PENDING",
          sentAt: new Date(),
        });
      });
      await employee.save();
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = documentController;
