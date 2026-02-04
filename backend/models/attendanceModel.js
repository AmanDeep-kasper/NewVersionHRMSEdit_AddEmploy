const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeObjID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    position: { type: mongoose.Schema.Types.ObjectId, ref: "Position" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    years: [
      {
        year: Number,
        months: [
          {
            month: Number,
            dates: [
              {
                date: Number,
                day: Number,
                loginTime: [],
                logoutTime: [],
                loginTimeMs: [],
                logoutTimeMs: [],
                LogData: [],
                TotalLogin: { type: Number, default: 0 },
                breakTime: [],
                breakTimeMs: [],
                resumeTimeMS: [],
                ResumeTime: [],
                BreakData: [],
                totalBrake: { type: Number, default: 0 },
                totalLogAfterBreak: { type: Number, default: 0 },
                BreakReasion: [],
                LogStatus: {
                  type: String,
                  default: "--",
                },
                status: {
                  type: String,
                  default: "logout",
                },
                shifts: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Shift",
                  required: true,
                  default: "6763beb4a7a6fd1f58ceb5ab",
                },
                holiday: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Holiday",
                },
                LeaveApplication: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "LeaveApplication",
                },
                isNCNS: { type: Boolean, default: false },
                isForcedAbsent: { type: Boolean, default: false },
                isSandwhich: { type: Boolean, default: false },
                isOnLeave: { type: Boolean, default: false },
                LeaveObjectId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "LeaveApplication",
                },
                leaveAttendanceData: {
                  leaveType: {
                    type: String,
                    default: "",
                  },
                  leaveDuration: {
                    type: String,
                    default: "",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Pre-save middleware to calculate totalLogAfterBreak
attendanceSchema.pre("save", function (next) {
  let modified = false;

  this.years.forEach((year) => {
    year.months.forEach((month) => {
      month.dates.forEach((date) => {
        const calculatedValue = date.TotalLogin - date.totalBrake;
        if (date.totalLogAfterBreak !== calculatedValue) {
          date.totalLogAfterBreak = calculatedValue;
          modified = true; // Mark as modified if there's a change
        }
      });
    });
  });
  if (modified) {
    this.markModified("years");
  }
  next();
});

attendanceSchema.index({ employeeObjID: 1, createdAt: 1 });

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

const HolidaySchema = new mongoose.Schema({
  holidayYear: Number,
  holidayMonth: Number,
  holidayDate: Number,
  holidayDay: Number,
  holidayName: String,
  holidayType: String,
});

const Holiday = mongoose.model("Holiday", HolidaySchema);

module.exports = {
  AttendanceModel,
  Holiday,
};

