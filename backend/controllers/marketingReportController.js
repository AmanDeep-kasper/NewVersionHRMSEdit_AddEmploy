const MarketingReport = require("../models/marketingReportModel");

exports.createMarketingReport = async (req, res) => {
  try {
    const { liveUrl } = req.body; // Extract liveUrl from the request body

    // Check if the `liveUrl` already exists
    const existingLiveUrl = await MarketingReport.findOne({ liveUrl });
    if (existingLiveUrl) {
      return res.status(400).json({ error: "This live URL already exists." });
    }

    // Create a new report and save it
    const newReport = new MarketingReport(req.body);
    const savedReport = await newReport.save();

    // Respond with the saved report
    res.status(201).json(savedReport);
  } catch (error) {
    // Check if the error is validation-related or something else
    if (error.name === "ValidationError") {
      // Send a readable validation error
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    // Handle any other errors
    res.status(500).json({
      error: "An error occurred",
      message: error.message || "Unknown error",
    });
  }
};

// Bulk create marketing reports
exports.bulkCreateMarketingReports = async (req, res) => {
  try {
    const { reports } = req.body; // Extract the array of reports from the request body

    if (!Array.isArray(reports) || reports.length === 0) {
      return res
        .status(400)
        .json({ error: "Reports should be a non-empty array." });
    }

    // Check for duplicate `liveUrl` values
    const liveUrls = reports.map((report) => report.liveUrl);
    const existingReports = await MarketingReport.find({
      liveUrl: { $in: liveUrls },
    });

    if (existingReports.length > 0) {
      const existingUrls = existingReports.map((report) => report.liveUrl);
      return res.status(400).json({
        error: "Some live URLs already exist.",
        existingUrls,
      });
    }

    // Insert multiple documents into the database
    const insertedReports = await MarketingReport.insertMany(reports);

    // Respond with the inserted documents
    res.status(201).json(insertedReports);
  } catch (error) {
    // Handle validation or other errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    res.status(500).json({
      error: "An error occurred",
      message: error.message || "Unknown error",
    });
  }
};

// Get all marketing reports

exports.getAllMarketingReports = async (req, res) => {
  try {
    // Populate the 'user' field with data from the Employee model
    const reports = await MarketingReport.find().populate({
      path: "user",
      select: "FirstName LastName Email ContactNo role reportManager",
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single marketing report by ID
exports.getMarketingReportById = async (req, res) => {
  try {
    const report = await MarketingReport.findById(req.params.id).populate({
      path: "user",
      select: "FirstName LastName Email ContactNo role reportManager",
    });
    if (!report) {
      return res.status(404).json({ message: "Marketing report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a marketing report by ID
exports.updateMarketingReportById = async (req, res) => {
  try {
    const updatedReport = await MarketingReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ message: "Marketing report not found" });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a marketing report by ID
exports.deleteMarketingReportById = async (req, res) => {
  try {
    const deletedReport = await MarketingReport.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReport) {
      return res.status(404).json({ message: "Marketing report not found" });
    }
    res.status(200).json({ message: "Marketing report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadMarketingReport = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "No data provided for upload" });
    }

    // Validate that all required fields are present in the incoming data
    const validateData = data.every((row) => {
      return (
        row.datePosted &&
        row.liveUrl &&
        row.title &&
        row.da &&
        row.pa &&
        row.ss &&
        row.backLinkType &&
        row.statusType
      );
    });

    if (!validateData) {
      return res
        .status(400)
        .json({ message: "Missing required fields in the data" });
    }

    // Insert data into database
    await MarketingReport.insertMany(data);
    return res.status(201).json({ message: "Data uploaded successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload data", error: error.message });
  }
};
