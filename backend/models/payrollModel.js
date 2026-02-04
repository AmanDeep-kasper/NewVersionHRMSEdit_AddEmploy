const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payrollSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  finalSalary: {
    type: Number,
    required: true,
  },
  leavesTaken: [
    {
      type: Schema.Types.ObjectId,
      ref: 'LeaveApplication',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = { Payroll };
