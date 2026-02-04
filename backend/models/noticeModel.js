const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
 
  notice: { type: String, required: true },
  attachments: { type: String },
  creator: { type: String, required: true },
  creatorMail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Notice = mongoose.model("Notice", NoticeSchema);

module.exports = Notice;
