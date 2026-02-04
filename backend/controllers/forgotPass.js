const { Employee } = require("../models/employeeModel");
const otpModule = require("../models/otpModel");
const SendMails = require("../sendMail/sendMail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

const SALT_FECTOUR = Number(process.env.SALT_FECTOUR) || 10;
const OTP_EXPIRY_SECONDS = Number(process.env.OTP_EXPIRY_SECONDS) || 60;
const RESET_SESSION_TTL_MS = Number(process.env.RESET_TOKEN_TTL_MS) || 15 * 60 * 1000;
const MAX_OTP_RETRIES = Number(process.env.MAX_OTP_RETRIES) || 5;
const OTP_BLOCK_DURATION_MS = Number(process.env.OTP_BLOCK_DURATION_MS) || 60 * 1000;

// =====================
// HELPERS
// =====================
const sendError = (res, code, message) => res.status(code).json({ success: false, message });
const sendSuccess = (res, code, data) => res.status(code).json({ success: true, ...data });

// =====================
// 1️⃣ VERIFY EMAIL
// =====================
const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 400, "Email is required");

    const user = await Employee.findOne({ Email: email }).select("-Password");
    if (!user) return sendError(res, 404, "Invalid email");

    return sendSuccess(res, 200, { message: "Email verified", userId: user._id });
  } catch (err) {
    console.error("emailVerify:", err);
    return sendError(res, 500, "Server error");
  }
};

// =====================
// 2️⃣ SEND OTP
// =====================
const sendOtp = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendError(res, 400, "User ID required");

    const user = await Employee.findById(id);
    if (!user) return sendError(res, 404, "User not found");

    let record = await otpModule.findOne({ userId: id });

    if (record?.blockedUntil > Date.now()) {
      const sec = Math.ceil((record.blockedUntil - Date.now()) / 1000);
      return sendError(res, 429, `Try again after ${sec}s`);
    }

    if (record?.expiresAt > Date.now() && record.otp) {
      const sec = Math.ceil((record.expiresAt - Date.now()) / 1000);
      return sendError(res, 429, `Wait ${sec}s`);
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await otpModule.findOneAndUpdate(
      { userId: id },
      {
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000),
        retryCount: 0,
        blockedUntil: null,
        resetSessionHash: null,         // Invalidate old reset sessions
        resetSessionExpires: null,
      },
      { upsert: true, new: true }
    );

    await SendMails(otp, user.Email, user.FirstName);

    return sendSuccess(res, 200, { message: "OTP sent", expiresIn: OTP_EXPIRY_SECONDS });
  } catch (err) {
    console.error("sendOtp:", err);
    return sendError(res, 500, "Failed to send OTP");
  }
};

// =====================
// 3️⃣ VERIFY OTP & ISSUE RESET SESSION
// =====================
const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return sendError(res, 400, "Invalid request");

    const record = await otpModule.findOne({ userId });
    if (!record || record.expiresAt < Date.now() || !record.otp)
      return sendError(res, 410, "OTP expired");

    const validOtp = await bcrypt.compare(otp, record.otp);
    if (!validOtp) {
      record.retryCount++;
      if (record.retryCount >= MAX_OTP_RETRIES) {
        record.blockedUntil = new Date(Date.now() + OTP_BLOCK_DURATION_MS);
      }
      await record.save();
      return sendError(res, 400, "Invalid OTP");
    }

    // Clear OTP and generate reset session
    record.otp = null;
    record.expiresAt = null;
    record.retryCount = 0;
    record.blockedUntil = null;

    const resetSession = crypto.randomBytes(64).toString("hex");
    record.resetSessionHash = await bcrypt.hash(resetSession, 10);
    record.resetSessionExpires = new Date(Date.now() + RESET_SESSION_TTL_MS);

    await record.save();

    // Set secure HttpOnly cookie
    res.cookie("reset_session", resetSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: RESET_SESSION_TTL_MS,
    });

    return sendSuccess(res, 200, { message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp:", err);
    return sendError(res, 500, "OTP verification failed");
  }
};

// =====================
// 4️⃣ CHECK RESET SESSION
// =====================
const checkResetSession = async (req, res) => {
  try {
    const token = req.cookies.reset_session;
    if (!token) return sendError(res, 401, "Invalid reset session");

    const record = await otpModule.findOne({
      resetSessionExpires: { $gt: Date.now() },
      resetSessionHash: { $ne: null },
    });

    if (!record) return sendError(res, 401, "Reset session expired");

    const valid = await bcrypt.compare(token, record.resetSessionHash);
    if (!valid) return sendError(res, 401, "Invalid reset session");

    return sendSuccess(res, 200, { message: "Session valid" });
  } catch (err) {
    console.error("checkResetSession:", err);
    return sendError(res, 500, "Session validation failed");
  }
};

// =====================
// 5️⃣ RESET PASSWORD
// =====================
const forgetUserPass = async (req, res) => {
  try {
    const { pass, confirm_pass } = req.body;
    const token = req.cookies.reset_session;

    if (!token) return sendError(res, 401, "Reset session missing");
    if (!pass || pass !== confirm_pass)
      return sendError(res, 400, "Password mismatch");

    const record = await otpModule.findOne({
      resetSessionExpires: { $gt: Date.now() },
      resetSessionHash: { $ne: null },
    });

    if (!record) return sendError(res, 401, "Reset session expired");

    const valid = await bcrypt.compare(token, record.resetSessionHash);
    if (!valid) return sendError(res, 401, "Invalid reset session");

    const hashed = await bcrypt.hash(pass, SALT_FECTOUR);
    await Employee.findByIdAndUpdate(record.userId, { Password: hashed });

    // 🔒 HARD INVALIDATION
    record.resetSessionHash = null;
    record.resetSessionExpires = null;
    await record.save();

    res.clearCookie("reset_session");

    return sendSuccess(res, 200, { message: "Password updated" });
  } catch (err) {
    console.error("forgetUserPass:", err);
    return sendError(res, 500, "Password reset failed");
  }
};

module.exports = {
  emailVerify,
  sendOtp,
  verifyOtp,
  checkResetSession,
  forgetUserPass,
};
