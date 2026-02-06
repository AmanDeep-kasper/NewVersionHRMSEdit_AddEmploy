const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    taskId: { type: String },
    taskName: { type: String },
    senderMail: { type: String },
    status: { type: String },
    path: { type: String },
    message: { type: String },
    messageBy: { type: String },
    profile: { type: String },
  },
  { timestamps: true }
);

const employeeSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String },
    empID: { type: String, required: true, unique: true }, // Unique Employee ID
    Email: { type: String, lowercase: true, trim: true, required: true, unique: true, }, // Email must be unique
    Password: { type: String, required: true },
    Gender: { type: String, required: true },
    DOB: { type: Date },
    reportManager: { type: String, lowercase: true, trim: true },
    reportHr: { type: String, lowercase: true, trim: true },
    DateOfJoining: { type: Date },
    TerminateDate: { type: Date },
    Deleted: { type: Boolean, default: false },
    profile: {
      image_url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    ContactNo: { type: String },
    Account: { type: Number },
    role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    position: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
    department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
    salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    familyInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyInfo" }],
    workExperience: [
      { type: mongoose.Schema.Types.ObjectId, ref: "WorkExperience" },
    ],
    leaveApplication: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LeaveApplication" },
    ],
    attendanceObjID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
    BloodGroup: { type: String },
    EmergencyContactNo: { type: String },
    presonalEmail: { type: String, default: "N/A" },
    Hobbies: { type: String, default: "N/A" },
    PANcardNo: { type: String, default: "N/A" },
    PermanetAddress: { type: String, default: "N/A" },
    PresentAddress: { type: String, default: "N/A" },
    BankName: { type: String, default: "N/A" },
    BankAccount: { type: String, sparse: true, default: "N/A" },
    // BankAccount: { type: String, sparse: true },

    BankIFSC: { type: String, default: "N/A" },
    UANNumber: { type: String, default: "N/A" },
    LocationType: { type: String, default: "On site" },
    Notification: [notificationSchema],
    Notice: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],
    Request: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
    status: { type: String, default: "active" },
    loginStatus: { type: String, default: "loggedOut" },
    shifts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
    ],
    // ✅ Shift History - Stores past shift changes
    shiftHistory: [
      {
        shift: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shift",
          required: true,
        },
        updatedOn: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    // ✅ Permissions and Final Clearance
    allowMobileLogin: {
      type: String,
      enum: ["Allowed", "Not Allowed"],
      default: "Allowed",
    },

    isFullandFinal: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    // ✅ Scheduled Shift Change - For future updates based on scheduler
    scheduledShiftChange: {
      shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift" },
      effectiveDate: { type: Date },
    },
  },
  { timestamps: true },
);
employeeSchema.index({ FirstName: 1, LastName: 1, });

employeeSchema.index({ empID: 1 });
employeeSchema.index({ Email: 1 });
employeeSchema.index({ ContactNo: 1 });
employeeSchema.index({ Account: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ isFullandFinal: 1 });
employeeSchema.index({ createdAt: -1 });

// Text index for search
employeeSchema.index({
  FirstName: "text",
  LastName: "text",
  Email: "text",
  empID: "text",
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { Employee };
