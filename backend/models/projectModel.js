const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  CreatedBy: { type: String },
  CreatedDate: { type: Date, default: Date.now },
  Deleted: { type: Boolean },
  EmpFullName: { type: String },
  EstimatedCost: { type: Number },
  EstimatedTime: { type: Number },
  ModifiedBy: { type: String },
  ModifiedDate: { type: Date },
  ProjectDesc: { type: String },
  ProjectTitle: { type: String, required: true },
  ProjectURL: { type: String },
  Remark: { type: String },
  TimePeriod: { type: String },
  Currency: { type: String },
  Status: { type: Number, required: true },

  portals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portal" }],
});
const Project = mongoose.model("Project", projectSchema);

module.exports = {
  Project,
};
