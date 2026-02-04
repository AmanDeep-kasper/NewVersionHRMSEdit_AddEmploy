const WeekendSettings = require("../../models/Settings/WeekendSettingsModal");

// Controller to get the weekend settings
const getWeekendSettings = async (req, res) => {
  try {
    const settings = await WeekendSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching weekend settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to save/update the weekend settings
const saveWeekendSettings = async (req, res) => {
  const { selectedDays, frequencies } = req.body;

  // Validate input
  if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
    return res
      .status(400)
      .json({ message: "Please select at least one weekend day." });
  }

  try {
    // If settings exist, update them; otherwise, create new
    const existingSettings = await WeekendSettings.findOne();
    if (existingSettings) {
      existingSettings.selectedDays = selectedDays;
      existingSettings.frequencies = frequencies;
      await existingSettings.save();
      return res.json({ message: "Weekend settings updated successfully!" });
    }

    // If no existing settings, create new
    const newSettings = new WeekendSettings({
      selectedDays,
      frequencies,
    });
    await newSettings.save();
    res.json({ message: "Weekend settings saved successfully!" });
  } catch (error) {
    console.error("Error saving weekend settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWeekendSettings, saveWeekendSettings };
