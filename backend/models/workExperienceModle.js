const mongoose = require("mongoose");

const workExperienceSchema = new mongoose.Schema({
  CompanyName: { type: String, required: true },
  Designation: { type: String, required: true },
  FromDate: { type: Date, required: true },
  ToDate: { type: Date, required: true },
  Duration: { type: String },
});

const WorkExperience = mongoose.model("WorkExperience", workExperienceSchema);
module.exports = WorkExperience;
