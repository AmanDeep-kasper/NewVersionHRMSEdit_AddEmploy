const mongoose = require("mongoose");

// Initialize auto-increment for CityID
// autoIncrement.initialize(connection);

const portalSchema = new mongoose.Schema({
  CreatedBy: { type: String },
  CreatedDate: { type: Date, default: Date.now },
  Deleted: { type: Boolean },
  ModifiedBy: { type: String },
  ModifiedDate: { type: Date },
  PortalName: { type: String, required: true },
  Status: { type: Number, required: true }
});

// portalSchema.plugin(autoIncrement.plugin, {
//   model: "Portal",
//   field: "ID"
// });

const Portal = mongoose.model("Portal", portalSchema);

module.exports = {
  Portal
};
