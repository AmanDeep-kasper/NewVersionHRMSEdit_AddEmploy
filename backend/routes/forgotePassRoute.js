const express = require("express");

const {
  emailVerify,
  sendOtp,
  verifyOtp,
  forgetUserPass,
  checkResetSession,
} = require("../controllers/forgotPass");

const {
  otpSendLimiter,
  otpVerifyLimiter,
  passwordResetLimiter,
} = require("../middleware/rateLimiter");

const forgotPassRoute = express.Router();

/* ================= ROUTES ================= */

// 1️⃣ Verify email exists
forgotPassRoute.post("/verify_email", emailVerify);

// 2️⃣ Send OTP (rate-limited)
forgotPassRoute.post("/send_otp/:id", otpSendLimiter, sendOtp);

// 3️⃣ Verify OTP → issue reset token (rate-limited)
forgotPassRoute.post("/verify_otp", otpVerifyLimiter, verifyOtp);

// 4️⃣ Reset password (rate-limited)
forgotPassRoute.post("/forgot_pass", passwordResetLimiter, forgetUserPass);

// 5️⃣ Check reset session (ANTI-BURP / stage-3 protection)
forgotPassRoute.get("/reset-session-check", checkResetSession);

module.exports = forgotPassRoute;
