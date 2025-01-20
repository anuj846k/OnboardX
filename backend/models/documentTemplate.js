const mongoose = require("mongoose");

const documentTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  isRequired: { type: Boolean, default: true },
  description: String,
  docusignTemplateId: String,
  category: {
    type: String,
    enum: ["ONBOARDING", "COMPLIANCE", "BENEFITS", "OTHER"],
    default: "ONBOARDING",
  },
});

module.exports = mongoose.model("DocumentTemplate", documentTemplateSchema);
