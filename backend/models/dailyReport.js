const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  reportedDate: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  complication: { type: String, default: "N/A" },
  link: { type: String, default: "N/A" },
  remarks: { type: String, default: "N/A" },
});

const DailyReport = mongoose.model("DailyReport", dailyReportSchema);

module.exports = DailyReport;
