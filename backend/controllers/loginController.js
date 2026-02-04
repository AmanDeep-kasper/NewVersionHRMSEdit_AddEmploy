const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Employee } = require("../models/employeeModel");
const RefreshToken = require("../models/RefreshToken.logout");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const JWTKEY = process.env.JWTKEY;

// ------------------------
// Validation
// ------------------------
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().max(100).required(),
});

// ------------------------
// Login
// ------------------------
const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find employee
    const employee = await Employee.findOne({ Email: email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2️⃣ Check password
    const match = await bcrypt.compare(password, employee.Password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3️⃣ Generate sessionId
    const sessionId = crypto.randomUUID();

    // 4️⃣ OPTIONAL BUT RECOMMENDED
    // 🔥 Remove old sessions (prevents old-token reuse)
    await RefreshToken.deleteMany({ user: employee._id });

    // 5️⃣ Create ACCESS TOKEN (15 min)
    const accessToken = jwt.sign(
      {
        _id: employee._id,
        role: employee.Role,
        Account: employee.Account,
        sessionId,
      },
      process.env.JWTKEY,
      { expiresIn: "15m" }
    );

    // 6️⃣ Create REFRESH TOKEN (7 days)
    const refreshToken = jwt.sign(
      {
        _id: employee._id,
        sessionId,
      },
      process.env.JWTKEY,
      { expiresIn: "7d" }
    );

    // 7️⃣ Store refresh token session in DB
    await RefreshToken.create({
      token: refreshToken,
      user: employee._id,
      sessionId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 8️⃣ Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // 9️⃣ Set cookies
    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🔟 Send SAFE user data (❌ never send password)
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: employee._id,
        Account: employee.Account,
        role: employee.Role,
        FirstName: employee.FirstName,
        LastName: employee.LastName,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ------------------------
// Refresh token
// ------------------------
const refreshTokenController = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken) return res.sendStatus(403);

    const decoded = jwt.verify(oldToken, JWTKEY);

    const session = await RefreshToken.findOne({
      token: oldToken,
      sessionId: decoded.sessionId,
      revoked: false,
    });

    if (!session) return res.sendStatus(403);

    // 🔥 Revoke old refresh token
    session.revoked = true;
    await session.save();

    // 🔥 Get fresh user data (IMPORTANT)
    const employee = await Employee.findById(decoded._id);
    if (!employee) return res.sendStatus(403);

    // 🔄 New refresh token
    const newRefreshToken = jwt.sign(
      { _id: employee._id, sessionId: decoded.sessionId },
      JWTKEY,
      { expiresIn: "7d" },
    );

    await RefreshToken.create({
      token: newRefreshToken,
      user: employee._id,
      sessionId: decoded.sessionId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 🔄 New access token
    const newAccessToken = jwt.sign(
      {
        _id: employee._id,
        role: employee.Role,
        Account: employee.Account,
        sessionId: decoded.sessionId,
      },
      JWTKEY,
      { expiresIn: "15m" },
    );

    // ✅ DEFINE cookieOptions HERE
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("token", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.sendStatus(403);
  }
};



// ------------------------
// Logout
// ------------------------
const logoutEmployee = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, JWTKEY);

        // 🔥 Revoke ONLY this session
        await RefreshToken.updateOne(
          {
            token: refreshToken,
            sessionId: decoded.sessionId,
          },
          { revoked: true }
        );
      } catch (err) {
        // ❌ Token expired / tampered → ignore
      }
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};



// ------------------------
// Get user data
const getUserData = async (req, res) => {
  try {
    const user = await Employee.findById(req.user._id).select("-Password");
    if (!user) return res.sendStatus(404);

    res.json({ user });
  } catch (err) {
    res.sendStatus(500);
  }
};


module.exports = {
  loginEmployee,
  refreshTokenController,
  logoutEmployee,
  getUserData,
};
