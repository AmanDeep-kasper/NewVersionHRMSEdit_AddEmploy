const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  CountryID: {
    type: String,
    unique: true,
    default: function () {
      return "C" + Math.floor(Math.random() * 1000000); // or use a counter
    },
  },
  CountryName: { type: String, required: true, unique: true },
  states: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }],
});

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
