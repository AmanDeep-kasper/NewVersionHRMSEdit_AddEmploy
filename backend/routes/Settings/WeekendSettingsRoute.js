const express = require("express");
const {
  getWeekendSettings,
  saveWeekendSettings,
} = require("../../controllers/settings/WeekendSettingsController");

const router = express.Router();

// Route to get weekend settings
router.get("/weekend-settings", getWeekendSettings);

// Route to save/update weekend settings
router.post("/weekend-settings", saveWeekendSettings);

module.exports = router;
