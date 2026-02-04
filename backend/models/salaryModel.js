const mongoose = require("mongoose");
const fieldEncryption = require("mongoose-field-encryption").fieldEncryption;
require("dotenv").config(); // Load environment variables

// Define the schema with number types
const salarySchema = new mongoose.Schema({
  BasicSalary: { type: Number, required: true },
  HRASalary: { type: Number, required: true },
  ConvenyanceAllowance: { type: Number, required: true },
  otherAllowance: { type: Number, required: true },
  totalSalary: { type: Number, required: true },
});

// Apply the encryption plugin
// salarySchema.plugin(fieldEncryption, {
//   fields: [
//     "BasicSalary",
//     "HRASalary",
//     "ConvenyanceAllowance",
//     "otherAllowance",
//     "totalSalary",
//   ],
//   secret: process.env.ENCRYPTION_SECRET,
//   saltGenerator: (secret) => "1234567890123456", // Must be 16 characters
// });

const Salary = mongoose.model("Salary", salarySchema);

module.exports = {
  Salary,
};


// const mongoose = require("mongoose");

// // Define the schema with number types
// var salarySchema = new mongoose.Schema({
//   BasicSalary: { type: Number, required: true },
//   HRASalary: { type: Number, required: true },
//   ConvenyanceAllowance: { type: Number, required: true },
//   otherAllowance: { type: Number, required: true },
//   totalSalary: { type: Number, required: true },
// });

// var Salary = mongoose.model("Salary", salarySchema);

// module.exports = {
//   Salary,
// };
