const mongoose = require("mongoose");

const MarketingReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  domain: { type: String, required: true },
  datePosted: { type: Date, required: true, default: Date.now() },
  liveUrl: { type: String, required: "true " },
  anchorTag: { type: String, default: "N/A" },
  title: { type: String, required: "true " },
  description: { type: String, required: "true " },
  targetedPage: { type: String, default: "N/A" },
  da: { type: String, required: "true " },
  pa: { type: String, required: "true " },
  ss: { type: String, required: "true " },
  backLinkType: { type: String, required: "true " },
  statusType: { type: String, required: "true " },
  remarks: { type: String, default: "N/A" },
});

const MarketingReport = mongoose.model(
  "MarketingReport",
  MarketingReportSchema
);

module.exports = MarketingReport;
