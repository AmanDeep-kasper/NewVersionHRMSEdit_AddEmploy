const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");
require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in .env file");
  process.exit(1);
}

/* ======================
   🔐 LOGIN LIMITER
====================== */
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again in 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    collectionName: "rateLimits",
    expireTimeMs: 5 * 60 * 1000,
    prefix: "login_",
  }),
  keyGenerator: (req) => {
    if (req.body.email)
      return `LOGIN_${req.body.email.toLowerCase()}`;
    return `LOGIN_${req.ip}`;
  },
  skipSuccessfulRequests: true,
});

/* ======================
   ⭐ OTP SEND LIMITER
====================== */
const otpSendLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: "Too many OTP requests. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    collectionName: "rateLimits",
    expireTimeMs: 1 * 60 * 1000,
    prefix: "otp_send_",
  }),
  keyGenerator: (req) =>
    `OTP_SEND_${req.params.id || "unknown"}_${req.ip}`,
  skipSuccessfulRequests: true,
});

/* ======================
   🔢 OTP VERIFY LIMITER
====================== */
const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many OTP attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    collectionName: "rateLimits",
    expireTimeMs: 10 * 60 * 1000,
    prefix: "otp_verify_",
  }),
  keyGenerator: (req) =>
    `OTP_VERIFY_${req.body.userId || req.ip}`,
});

/* ======================
   🔑 PASSWORD RESET LIMITER
====================== */
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many password reset attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    collectionName: "rateLimits",
    expireTimeMs: 15 * 60 * 1000,
    prefix: "password_reset_",
  }),
  keyGenerator: (req) =>
    `RESET_${req.cookies?.resetTokenId || req.ip}`,
});

/* ======================
   ✅ EXPORT ALL
====================== */
module.exports = {
  loginLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  passwordResetLimiter,
};
