const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    location: String,
  },
  employmentDetails: {
    department: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "CONTRACT", "INTERN"],
      required: true,
    },
  },
  onboardingStatus: {
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "NOT_STARTED",
    },
    documents: [
      {
        documentType: String,
        status: {
          type: String,
          enum: ["PENDING", "SENT", "SIGNED", "COMPLETED"],
          default: "PENDING",
        },
        docusignEnvelopeId: String,
        sentAt: Date,
        completedAt: Date,
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
