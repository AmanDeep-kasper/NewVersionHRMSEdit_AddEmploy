// middleware/requireResetToken.js
const otpModule = require("../models/otpModel");
const bcrypt = require("bcrypt");

module.exports = function requireResetToken() {
  return async (req, res, next) => {
    try {
      const userId = req.params.id; // route should include :id
      const rawToken = (req.cookies && req.cookies.resetToken) || req.headers["x-reset-token"];

      if (!rawToken) {
        return res.status(401).json({ message: "Reset token required" });
      }

      const record = await otpModule.findOne({ userId });
      if (!record || !record.resetTokenHash || !record.resetTokenExpires) {
        return res.status(401).json({ message: "Invalid or missing reset token" });
      }

      if (record.resetTokenExpires < new Date()) {
        // expired: clean up
        await otpModule.findByIdAndDelete(record._id).catch(() => {});
        return res.status(410).json({ message: "Reset token expired" });
      }

      const ok = await bcrypt.compare(rawToken, record.resetTokenHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid reset token" });
      }

      // token valid — attach record for controller and continue
      req.resetRecord = record;
      next();
    } catch (err) {
      console.error("requireResetToken error", err);
      return res.status(500).json({ message: "Server error validating reset token" });
    }
  };
};
