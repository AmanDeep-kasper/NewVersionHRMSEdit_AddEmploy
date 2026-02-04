const Joi = require('joi');

// Validation schema for creating a leave application
const LeaveApplicationValidation = Joi.object().keys({
  Leavetype: Joi.string().max(100).required(),  // Leave type (e.g., Sick Leave, Casual Leave)
  FromDate: Joi.date().required(), 
  ToDate: Joi.string().allow('').optional(),               // Start date of the leave       
  Reasonforleave: Joi.string().max(100).required(), // Reason for leave
  Status: Joi.number().min(0).max(1).required(), // Status of the application (e.g., 0: Pending, 1: Approved)
  aditionalManager: Joi.string().allow('').optional(), // Additional manager (if applicable, can be an empty string)
  managerEmail: Joi.string().email().allow('').optional(), // Manager's email address (can be an empty string)
  hrEmail: Joi.string().email().allow('').optional(),     // Additional manager (if applicable)
  managerEmail: Joi.string().email().optional(), // Manager's email address
  leaveDuration: Joi.string().required(), // Duration of leave in days
  totalLeaveRequired: Joi.number().required(),
});

// Validation schema for HR to update leave application status
const LeaveApplicationHRValidation = Joi.object().keys({
  Status: Joi.number().min(0).max(3).required(), // Status to be set by HR (e.g., 0: Pending, 1: Approved, 2: Denied, 3: Cancelled)
});

module.exports = {
  LeaveApplicationValidation,
  LeaveApplicationHRValidation,
};
