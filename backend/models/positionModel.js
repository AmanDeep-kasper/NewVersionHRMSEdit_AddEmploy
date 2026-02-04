const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  PositionName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});

const Position = mongoose.model("Position", positionSchema);

// Export the City model
module.exports = { Position };
