const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskID: { type: String, required: true, unmodifiable: true },
  pdf: [String],
  Taskname: String,
  Priority: String,
  description: String,
  startDate: String,
  endDate: String,
  status: String,
  duration: Number,
  department: String,
  comment: String,
  // Store acceptedAt in "DD/MM/YYYY" format
  acceptedAt: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v); // Validate DD/MM/YYYY format
      },
      message: (props) => `${props.value} is not a valid date format (DD/MM/YYYY)!`,
    },
  },  managerEmail: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  adminMail: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employees: [ {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    empTaskStatus: { type: String, required: true }, // You can adjust validation as needed
    empTaskComment: { type: String },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ], // Add this for multiple attachments
  }],

  
}, { timestamps: true });  // Corrected line



const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };

