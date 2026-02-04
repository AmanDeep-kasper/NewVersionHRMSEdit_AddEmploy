const mongoose = require("mongoose");

const reimbursementExpenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    type: {
      type: String,
      enum: [
        "Travel Expenses",
        "Food & Beverages",
        "Telephone Expenses",
        "Office supplies",
        "Office Expenses",
        "Medical Expenses",
        "Miscellaneous",
      ],
      required: true,
    },
    appliedAmount: { type: Number, required: true, min: 0 },
    approvedAmount: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    attachment: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Invalid attachment URL",
      },
    },
    details: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },
    finalRemarks: { type: String, default: "Still Pending" },
  },
  { timestamps: true }
);

const ReimbursementExpense = mongoose.model(
  "ReimbursementExpense",
  reimbursementExpenseSchema
);
module.exports = ReimbursementExpense;
