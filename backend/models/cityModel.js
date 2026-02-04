const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  CityName: { type: String, required: true },
  state: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }]
});

const City = mongoose.model("City", citySchema);

// Export the City model
module.exports = City;
