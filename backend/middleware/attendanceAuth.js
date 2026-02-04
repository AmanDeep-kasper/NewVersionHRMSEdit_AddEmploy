const jwt = require("jsonwebtoken");
const { Employee } = require("../models/employeeModel");
require("dotenv").config(); // Load environment variables
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded._id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    req.employee = employee;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authenticateToken;
