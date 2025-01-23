const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { protect, restrictTo } = require('../middleware/auth');

router.post("/templates", protect, restrictTo('HR'), documentController.addDocumentTemplate);
router.get("/templates", protect, documentController.getAllTemplates);
router.post(
  "/employees/:employeeId/documents",
  protect,
  restrictTo('HR'),
  documentController.assignDocumentToEmployees
);

module.exports = router;  