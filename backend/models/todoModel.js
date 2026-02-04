const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    isRepeating: { type: Boolean, default: false },
    frequency: { type: String, default: "One Time" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
