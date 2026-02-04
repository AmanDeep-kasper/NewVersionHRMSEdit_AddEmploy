const mongoose = require("mongoose");

const weekendSettingsSchema = new mongoose.Schema({
  selectedDays: {
    type: [Number],
    required: true,
  },
  frequencies: {
    type: Map,
    of: String,
    default: {},
  },
});

const WeekendSettings = mongoose.model(
  "WeekendSettings",
  weekendSettingsSchema
);

module.exports = WeekendSettings;
