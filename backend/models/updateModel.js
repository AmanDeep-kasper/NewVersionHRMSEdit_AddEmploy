  const momgoose = require("mongoose");

  const updateSchema = new momgoose.Schema({
    participants: [
      {
        type: String,
      },
    ],
    taskId: { type: String, require: true },
    bwt: { type: String, require: true },
    message: [
      {
        text: { type: String },
        from: { type: String },
        to: { type: Array },
        createAt: { type: Date, default: Date.now },
        status: { type: String, default: "unseen" },
        fromName: { type: String },
      },
    ],
  });

  const Update = new momgoose.model("update", updateSchema);

  module.exports = Update;
