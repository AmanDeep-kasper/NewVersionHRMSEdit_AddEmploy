const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  DepartmentName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});


const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
