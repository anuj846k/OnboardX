const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

router.post("/templates", documentController.addDocumentTemplate);
router.get("/templates", documentController.getAllTemplates);
router.post(
  "/employees/:employeeId/documents",
  documentController.assignDocumentToEmployees
);

module.exports = router;
