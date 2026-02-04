const DailyReport = require("../models/dailyReport");

exports.createReport = async (req, res) => {
  try {
    const report = new DailyReport(req.body);
    await report.save();
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await DailyReport.find().populate({
      path: "user",
      select: "FirstName LastName Email ContactNo role reportManager",
    });
    
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id).populate({
      path: "user",
      select: "FirstName LastName Email ContactNo role reportManager",
    });
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
