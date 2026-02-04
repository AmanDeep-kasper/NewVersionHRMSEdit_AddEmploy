const mongoose = require("mongoose");

// Create a new schema for ticket counters to handle the auto-incrementing ticketID
const ticketCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const TicketCounter = mongoose.model("TicketCounter", ticketCounterSchema);

const requestSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    requestedBy: { type: String, required: true },
    cc: { type: Array, required: true },
    reOpen: { type: Array },
    subject: { type: String, required: true },
    remark: { type: String, required: true },
    updatedBy: { type: String },
    status: { type: String, default: "Pending" },
    priority: {
      type: String,
      enum: ["Urgent", "High", "Medium", "Low"],
      default: "Medium",
    },
    ticketID: { type: String, unique: true },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment ticketID
requestSchema.pre("save", async function (next) {
  const doc = this;

  // Find the current ticket counter or initialize if not present
  const counter = await TicketCounter.findByIdAndUpdate(
    { _id: "ticketID" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Generate ticketID with zero-padded sequence number
  doc.ticketID = `TKT${counter.seq.toString().padStart(4, "0")}`;

  next();
});

const Request = mongoose.model("Request", requestSchema);

module.exports = { Request };
