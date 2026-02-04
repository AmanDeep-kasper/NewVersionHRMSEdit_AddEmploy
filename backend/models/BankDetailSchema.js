const mongoose = require("mongoose");

const BankDetailSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true, // One bank detail per employee
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String, // Changed to String to handle large numbers
      required: true,
      unique: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
    bankBranch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to format fields
BankDetailSchema.pre("save", function (next) {
  if (this.bankName) {
    this.bankName = this.bankName.toUpperCase();
  }
  if (this.bankBranch) {
    this.bankBranch = this.bankBranch.toUpperCase();
  }
  if (this.ifsc) {
    this.ifsc = this.ifsc.toUpperCase();
  }
  if (this.accountNumber) {
    this.accountNumber = this.accountNumber.toUpperCase();
  }
  next();
});

module.exports = mongoose.model("BankDetail", BankDetailSchema);
