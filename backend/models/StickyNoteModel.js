const mongoose = require("mongoose");

const stickyNoteSchema = new mongoose.Schema(
  {
    tittle: { type: String, default: "Untitled" },
    text: { type: String, required: true },
    color: { type: String, required: true, default: "#ff7eb9" },
    isStarred: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    x: { type: Number, default: 0 }, // X position of the note
    y: { type: Number, default: 0 }, // Y position of the note
    width: { type: Number, default: 260 }, // Width of the note
    height: { type: Number, default: 240 }, // Height of the note
  },
  { timestamps: true }
);

module.exports = mongoose.model("StickyNote", stickyNoteSchema);
