const mongoose = require("mongoose");

function generateDateRange(fromDate, toDate) {
  const dateArray = [];
  let currentDate = new Date(fromDate);
  const endDate = new Date(toDate);

  while (currentDate <= endDate) {
    const day = String(currentDate.getDate()).padStart(2, "0"); 
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`; 
    dateArray.push(formattedDate);

    currentDate.setDate(currentDate.getDate() + 1); 
  }

  return dateArray;
}

const leaveApplicationSchema = new mongoose.Schema(
  {
    Leavetype: { type: String, required: true },
    FromDate: { type: Date, required: true },
    dateRange: {
      type: [String],
      required: true,
    },
    ToDate: { type: Date },
    Reasonforleave: { type: String, required: true },
    Status: { type: String, required: true },
    updatedBy: { type: String, default: null },
    createdOn: { type: Date, default: Date.now },
    reasonOfRejection: { type: String, default: null },
    aditionalManager: { type: String },
    leaveDuration: { type: String },
    employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

// Middleware to populate dateRange before saving the document
leaveApplicationSchema.pre("save", function (next) {
  if (this.FromDate) {
    // If ToDate is not provided, set it to FromDate
    if (!this.ToDate) {
      this.ToDate = this.FromDate;
    }
    this.dateRange = generateDateRange(this.FromDate, this.ToDate);
  }
  next();
});

const LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationSchema
);

module.exports = {
  LeaveApplication,
};
