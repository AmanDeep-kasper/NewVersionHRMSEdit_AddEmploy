const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
      index: true,
    },

    // OTP stage
    otp: { type: String, default: null },
    expiresAt: { type: Date, default: null },
    retryCount: { type: Number, default: 0 },
    blockedUntil: { type: Date, default: null },

    // 🔐 RESET SESSION (FINAL STAGE)
    resetSessionHash: { type: String, default: null, index: true },
    resetSessionExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

/* ====================================================== */
/* TTL INDEXES */
/* ====================================================== */

// Auto-delete OTP documents after expiry (only if OTP exists)
otpSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { otp: { $ne: null } },
  }
);

// Auto-delete reset sessions after expiry (only if resetSessionHash exists)
otpSchema.index(
  { resetSessionExpires: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { resetSessionHash: { $ne: null } },
  }
);

module.exports = mongoose.model("Otp", otpSchema);
