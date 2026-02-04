const { unique } = require("joi/lib/types/array");
const mongoose = require("mongoose");

const familyInfoSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true, trim: true },
    Relationship: { type: String, required: true, trim: true },
    DOB: { type: Date, required: true },
    Occupation: { type: String, required: true, trim: true },
    parentMobile: { type: String, required: true, trim: true, unique: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  { timestamps: true }
);

const FamilyInfo = mongoose.model("FamilyInfo", familyInfoSchema);

module.exports = { FamilyInfo };
