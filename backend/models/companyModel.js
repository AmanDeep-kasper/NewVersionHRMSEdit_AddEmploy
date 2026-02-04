const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  CompanyName: { type: String, required: true },
  Address: { type: String, required: true },
  PostalCode: { type: Number, required: true },
  Website: { type: String, required: true },
  Email: { type: String, required: true },
  ContactPerson: { type: String, required: true },
  ContactNo: { type: String, required: true },
  FaxNo: { type: String, required: true },
  PanNo: { type: String, required: true },
  GSTNo: { type: String, required: true },
  CINNo: { type: String, required: true },
  // Branding assets
  logoUrl: { type: String, default: null },
  miniIconUrl: { type: String, default: null },
  Deleted: { type: Boolean },
  city: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }]
});

// // Initialize auto-increment for CityID
// autoIncrement.initialize(connection);

// companySchema.plugin(autoIncrement.plugin, {
//     model: "Company",
//     field: "CompanyID"
// });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
