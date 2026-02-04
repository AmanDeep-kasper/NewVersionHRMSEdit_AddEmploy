// GET break/resume/total break info for a specific date (no update)

const { AttendanceModel, Holiday } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");
const Shift = require("../models/ShiftModel");
const schedule = require("node-schedule");
const Moment = require("moment-timezone");
const { checkEmployeeEarlyLogin } = require("../schedule/earlyLoginChecker");
const { markAttendance, calculateTotal } = require("../utils/attendanceUtils");
const calculateAttendanceTotals = require("../utils/attendanceTotals");
const mongoose = require("mongoose");

const createAttendance = async (req, res) => {
  const {
    employeeId,
    breakTime,
    breakTimeMs,
    ResumeTime,
    resumeTimeMS,
    BreakReasion,
    status,
    totalLogAfterBreak,
  } = req.body;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  const isWeekend = (() => {
    const day = currentDate.getDay(); // Get the current day (0 = Sunday, 6 = Saturday)
    if (day === 0) return true; // Sunday is always a weekend

    if (day === 6) {
      // Check if it’s a Saturday
      const date = currentDate.getDate(); // Get the current date (1-31)
      const weekOfMonth = Math.ceil(date / 7); // Calculate which week of the month it is
      return weekOfMonth === 2 || weekOfMonth === 4; // Return true for 2nd or 4th Saturday
    }

    return false; // Other days are not weekends
  })();
  const currentTimeMs = Math.round(
    Moment().tz("Asia/Kolkata").valueOf() / 1000 / 60,
  );
  const currentTime = Moment().tz("Asia/Kolkata").format("HH:mm:ss");

  let loginTime;
  let logoutTime;
  let loginTimeMs;
  let logoutTimeMs;
  let resumeTime;
  let ResumeTimeMS;
  let BreakTime;
  let BreakTimeMs;
  if (status === "login") {
    loginTime = [currentTime];
    loginTimeMs = [currentTimeMs];
  } else if (status === "logout") {
    logoutTime = [currentTime];
    logoutTimeMs = [currentTimeMs];
  }

  try {
    const employee = await Employee.findOne({
      _id: employeeId,
    }).populate("shifts");
    if (!employee) {
      return res
        .status(404)
        .json({ error: "Employee ID not found: " + employeeId });
    }
    let attendanceRecord = await AttendanceModel.findById({
      _id: employee.attendanceObjID,
    });
    const defaultShift = employee.shifts.length ? employee.shifts[0] : null;
    if (!defaultShift) {
      return res
        .status(400)
        .json({ error: "No shift assigned to the employee." });
    }

    let yearObject = attendanceRecord.years.find((y) => y.year === year);
    if (!yearObject) {
      yearObject = {
        year: year,
        months: [
          {
            month: month,
            dates: [
              {
                date: date,
                day: new Date(year, month - 1, currentDay).getDay(),
                loginTime: isWeekend ? ["WO"] : loginTime ? loginTime : [],
                logoutTime: isWeekend ? ["WO"] : [],
                loginTimeMs: isWeekend
                  ? ["WO"]
                  : loginTimeMs
                    ? loginTimeMs
                    : [],
                logoutTimeMs: isWeekend ? ["WO"] : [],
                breakTime: isWeekend ? [] : [],
                resumeTime: isWeekend ? [0] : [],
                breakTimeMs: isWeekend ? [0] : [],
                resumeTimeMS: isWeekend ? [0] : [],
                BreakReasion: isWeekend ? [] : [],
                BreakData: isWeekend ? [0] : [],
                status: isWeekend ? "WO" : "logout",
                totalBrake: isWeekend ? 0 : 0,
                shifts: defaultShift._id,
              },
            ],
          },
        ],
      };
      attendanceRecord.years.push(yearObject);
    }

    let monthObject = yearObject.months.find((m) => m.month === month);
    if (!monthObject) {
      monthObject = {
        month: month,
        dates: [
          {
            date: date,
            day: new Date(year, month - 1, currentDay).getDay(),
            loginTime: isWeekend ? ["WO"] : loginTime ? loginTime : [],
            logoutTime: isWeekend ? ["WO"] : [],
            loginTimeMs: isWeekend ? ["WO"] : loginTimeMs ? loginTimeMs : [],
            logoutTimeMs: isWeekend ? ["WO"] : [],
            breakTime: isWeekend ? [] : [],
            resumeTime: isWeekend ? [0] : [],
            breakTimeMs: isWeekend ? [0] : [],
            resumeTimeMS: isWeekend ? [0] : [],
            BreakReasion: isWeekend ? [] : [],
            BreakData: isWeekend ? [0] : [],
            status: isWeekend ? "WO" : "logout",
            totalBrake: isWeekend ? 0 : 0,
            shifts: defaultShift._id,
          },
        ],
      };
      yearObject.months.push(monthObject);
    }

    let dateObject = monthObject.dates.find((d) => d.date === date);

    if (!dateObject) {
      dateObject = {
        date: date,
        day: new Date(year, month - 1, currentDay).getDay(),
        loginTime: isWeekend ? ["WO"] : loginTime ? loginTime : [],
        logoutTime: isWeekend ? ["WO"] : [],
        loginTimeMs: isWeekend ? ["WO"] : loginTimeMs ? loginTimeMs : [],
        logoutTimeMs: isWeekend ? ["WO"] : [],
        breakTime: isWeekend ? [] : [],
        resumeTime: isWeekend ? [0] : [],
        breakTimeMs: isWeekend ? [0] : [],
        resumeTimeMS: isWeekend ? [0] : [],
        BreakReasion: isWeekend ? [] : [],
        BreakData: isWeekend ? [0] : [],
        status: isWeekend ? "WO" : "logout",
        totalBrake: isWeekend ? 0 : 0,
        shifts: defaultShift._id,
      };
      monthObject.dates.push(dateObject);
    } else if (dateObject.day === 0) {
      return res.status(400).json({ error: "Cannot modify data for Sunday." });
    }

    // Handling login and logout updates
    if (dateObject.logoutTime.length === dateObject.loginTime.length) {
      if (loginTime) {
        dateObject.loginTime = [...dateObject.loginTime, ...loginTime];
      }
      if (loginTimeMs) {
        dateObject.loginTimeMs = [...dateObject.loginTimeMs, ...loginTimeMs];
      }
    } else if (dateObject.logoutTime.length < dateObject.loginTime.length) {
      if (logoutTime) {
        dateObject.logoutTime = [...dateObject.logoutTime, ...logoutTime];
      }

      if (logoutTimeMs) {
        dateObject.logoutTimeMs = [...dateObject.logoutTimeMs, ...logoutTimeMs];

        const logoutTimeMSArray = dateObject.logoutTimeMs.slice(
          -logoutTimeMs.length,
        );
        const loginTimeMsArray = dateObject.loginTimeMs.slice(
          -logoutTimeMs.length,
        );

        const loginDataArray = logoutTimeMSArray.map((login, index) => {
          const LogMs = loginTimeMsArray[index];
          return login - LogMs;
        });

        dateObject.LogData = [...dateObject.LogData, ...loginDataArray];

        dateObject.TotalLogin = dateObject.LogData.reduce(
          (sum, value) => sum + value,
          0,
        );
        dateObject.totalLogAfterBreak = Math.max(
          0,
          dateObject.TotalLogin - dateObject.totalBrake,
        );
        dateObject.shifts = defaultShift._id;
      }
    }

    // Handling break and resume time updates
    if (breakTime) {
      BreakTime = [currentTime];
      BreakTimeMs = [currentTimeMs];
      if (dateObject.ResumeTime.length === dateObject.breakTime.length) {
        if (breakTime) {
          dateObject.breakTime = [...dateObject.breakTime, ...BreakTime];
        }
        if (breakTimeMs) {
          dateObject.breakTimeMs = [...dateObject.breakTimeMs, ...BreakTimeMs];
        }
      }
    } else if (ResumeTime) {
      resumeTime = [currentTime];
      ResumeTimeMS = [currentTimeMs];
      if (dateObject.ResumeTime.length < dateObject.breakTime.length) {
        if (resumeTimeMS) {
          dateObject.resumeTimeMS = [
            ...dateObject.resumeTimeMS,
            ...ResumeTimeMS,
          ];

          const resumeTimeMSArray = dateObject.resumeTimeMS.slice(
            -resumeTimeMS.length,
          );
          const breakTimeMsArray = dateObject.breakTimeMs.slice(
            -resumeTimeMS.length,
          );

          const breakDataArray = resumeTimeMSArray.map((Resume, index) => {
            const BreakMs = breakTimeMsArray[index];
            return Resume - BreakMs;
          });

          dateObject.BreakData = [...dateObject.BreakData, ...breakDataArray];

          dateObject.totalBrake = dateObject.BreakData.reduce(
            (sum, value) => sum + value,
            0,
          );
        }

        if (ResumeTime) {
          dateObject.ResumeTime = [...dateObject.ResumeTime, ...resumeTime];
        }
        if (BreakReasion) {
          dateObject.BreakReasion = [
            ...dateObject.BreakReasion,
            ...BreakReasion,
          ];
        }

        if (totalLogAfterBreak) {
          dateObject.totalLogAfterBreak =
            dateObject.TotalLogin >= dateObject.totalBrake
              ? dateObject.TotalLogin - dateObject.totalBrake
              : 0;
        }
      }
    }

    dateObject.status = status;
    await attendanceRecord.save();
    res.status(200).json({ message: "Attendance data updated successfully" });
  } catch (error) {
    console.error("Error updating attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Expose endpoint to check an individual employee for early login and notify
const checkEarlyForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId)
      return res
        .status(400)
        .json({ ok: false, message: "employeeId required" });
    const result = await checkEmployeeEarlyLogin(employeeId);
    res.status(200).json(result);
  } catch (err) {
    console.error("checkEarlyForEmployee error:", err);
    res.status(500).json({ ok: false, message: "error" });
  }
};

// Read-only endpoint to tell the client whether the employee is allowed to clock in now.
const canClockInForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId)
      return res
        .status(400)
        .json({ ok: false, message: "employeeId required" });

    // Prefer per-date assigned shift if available in today's attendance record.
    // Fetch attendance and populate nested shifts for today's date.
    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employeeId,
    }).populate("years.months.dates.shifts");

    // get today's date components in Asia/Kolkata
    const now = Moment().tz("Asia/Kolkata");
    const year = now.year();
    const month = now.month() + 1;
    const date = now.date();

    let shiftToUse = null;

    if (attendanceRecord && Array.isArray(attendanceRecord.years)) {
      const yearObj = attendanceRecord.years.find((y) => y.year === year);
      if (yearObj && Array.isArray(yearObj.months)) {
        const monthObj = yearObj.months.find((m) => m.month === month);
        if (monthObj && Array.isArray(monthObj.dates)) {
          const dateObj = monthObj.dates.find((d) => d.date === date);
          if (dateObj && dateObj.shifts) {
            shiftToUse = dateObj.shifts; // populated shift doc
          }
        }
      }
    }

    // Fall back to employee default shift
    if (!shiftToUse) {
      const employee = await Employee.findById(employeeId).populate("shifts");
      if (!employee)
        return res
          .status(404)
          .json({ ok: false, message: "employee not found" });
      shiftToUse =
        employee.shifts && employee.shifts.length ? employee.shifts[0] : null;
    }

    if (!shiftToUse || !shiftToUse.startTime) {
      // If no shift info, allow clock-in by default
      return res
        .status(200)
        .json({ ok: true, canClockIn: true, minutesToStart: 0 });
    }

    // Compute shift start moment for today in Asia/Kolkata timezone
    const shiftStartMoment = Moment(shiftToUse.startTime, "HH:mm").tz(
      "Asia/Kolkata",
    );
    const shiftStartMs = Math.round(shiftStartMoment.valueOf() / 1000 / 60); // minutes
    const earliestAllowedMs = shiftStartMs - 20; // 20 minutes before shift start
    const currentTimeMs = Math.round(
      Moment().tz("Asia/Kolkata").valueOf() / 1000 / 60,
    );

    const canClockIn = currentTimeMs >= earliestAllowedMs;
    const minutesToStart = Math.max(0, earliestAllowedMs - currentTimeMs);

    return res.status(200).json({ ok: true, canClockIn, minutesToStart });
  } catch (err) {
    console.error("canClockInForEmployee error:", err);
    return res.status(500).json({ ok: false, message: "internal error" });
  }
};

const createHolidays = async (req, res) => {
  try {
    const { holidayYear, holidayMonth, holidayDate, holidayName, holidayType } =
      req.body;

    console.log("Creating holiday with data:", {
      holidayYear,
      holidayMonth,
      holidayDate,
      holidayName,
      holidayType,
    });

    // Validate required fields
    if (!holidayYear || !holidayMonth || !holidayDate || !holidayName) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["holidayYear", "holidayMonth", "holidayDate", "holidayName"],
        received: { holidayYear, holidayMonth, holidayDate, holidayName },
      });
    }

    // Validate date values
    if (
      holidayMonth < 1 ||
      holidayMonth > 12 ||
      holidayDate < 1 ||
      holidayDate > 31
    ) {
      return res.status(400).json({
        error: "Invalid date values",
        details: "Month must be 1-12, Date must be 1-31",
      });
    }

    // Calculate the day of week for the holiday
    const holidayDay = new Date(
      holidayYear,
      holidayMonth - 1,
      holidayDate,
    ).getDay();

    // Create a new Holiday record using the Holiday model
    const newHoliday = new Holiday({
      holidayYear: Number(holidayYear),
      holidayMonth: Number(holidayMonth),
      holidayDate: Number(holidayDate),
      holidayDay,
      holidayName,
      holidayType: holidayType || "General",
    });

    // Save the Holiday record
    await newHoliday.save();
    console.log("Holiday saved successfully:", newHoliday._id);

    // Fetch all employees with attendance object ID
    const employees = await Employee.find()
      .populate("shifts")
      .select("_id attendanceObjID shifts");

    if (!employees.length) {
      console.warn("No employees found in system");
      return res.status(404).json({ error: "No employees found" });
    }

    console.log(`Found ${employees.length} employees to update`);

    // Loop through employees to update attendance
    let updatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const employee of employees) {
      try {
        if (!employee.attendanceObjID) {
          skippedCount++;
          continue; // Skip if no attendance record ID
        }

        const attendanceRecord = await AttendanceModel.findById(
          employee.attendanceObjID,
        );

        if (!attendanceRecord) {
          skippedCount++;
          continue; // Skip if attendance record not found
        }

        // Find or create the year object
        let yearObject = attendanceRecord.years.find(
          (y) => y.year === holidayYear,
        );
        if (!yearObject) {
          yearObject = {
            year: holidayYear,
            months: [
              {
                month: holidayMonth,
                dates: [
                  {
                    date: holidayDate,
                    day: holidayDay,
                    loginTime: ["HD"],
                    logoutTime: ["HD"],
                    loginTimeMs: ["HD"],
                    logoutTimeMs: ["HD"],
                    breakTime: [],
                    resumeTime: [],
                    breakTimeMs: [],
                    resumeTimeMS: [],
                    BreakReasion: [],
                    BreakData: [],
                    status: "HD",
                    holidayName,
                    totalBrake: 0,
                    totalLogAfterBreak: 0,
                    shifts: employee.shifts?.length
                      ? employee.shifts[0]._id
                      : null,
                    holiday: newHoliday._id,
                  },
                ],
              },
            ],
          };
          attendanceRecord.years.push(yearObject);
        } else {
          // Find or create the month object
          let monthObject = yearObject.months.find(
            (m) => m.month === holidayMonth,
          );
          if (!monthObject) {
            monthObject = {
              month: holidayMonth,
              dates: [
                {
                  date: holidayDate,
                  day: holidayDay,
                  loginTime: ["HD"],
                  logoutTime: ["HD"],
                  loginTimeMs: ["HD"],
                  logoutTimeMs: ["HD"],
                  breakTime: [],
                  resumeTime: [],
                  breakTimeMs: [],
                  resumeTimeMS: [],
                  BreakReasion: [],
                  BreakData: [],
                  status: "HD",
                  holidayName,
                  totalBrake: 0,
                  totalLogAfterBreak: 0,
                  shifts: employee.shifts?.length
                    ? employee.shifts[0]._id
                    : null,
                  holiday: newHoliday._id,
                },
              ],
            };
            yearObject.months.push(monthObject);
          } else {
            // Find or create the date object
            let dateObject = monthObject.dates.find(
              (d) => d.date === holidayDate,
            );
            if (!dateObject) {
              dateObject = {
                date: holidayDate,
                day: holidayDay,
                loginTime: ["HD"],
                logoutTime: ["HD"],
                loginTimeMs: ["HD"],
                logoutTimeMs: ["HD"],
                breakTime: [],
                resumeTime: [],
                breakTimeMs: [],
                resumeTimeMS: [],
                BreakReasion: [],
                BreakData: [],
                status: "HD",
                holidayName,
                totalBrake: 0,
                totalLogAfterBreak: 0,
                shifts: employee.shifts?.length ? employee.shifts[0]._id : null,
                holiday: newHoliday._id,
              };
              monthObject.dates.push(dateObject);
            } else {
              dateObject.holiday = newHoliday._id;
              dateObject.status = "HD";
              dateObject.loginTime = ["HD"];
              dateObject.logoutTime = ["HD"];
              dateObject.holidayName = holidayName;
            }
          }
        }

        await attendanceRecord.save();
        updatedCount++;
      } catch (empError) {
        console.error(
          `Error updating attendance for employee ${employee._id}:`,
          empError.message,
        );
        errors.push({
          employeeId: employee._id,
          error: empError.message,
        });
        skippedCount++;
      }
    }

    console.log(
      `Holiday creation complete. Updated: ${updatedCount}, Skipped: ${skippedCount}`,
    );

    res.status(201).json({
      success: true,
      message: `Holiday created successfully. Updated: ${updatedCount} employees, Skipped: ${skippedCount}`,
      newHoliday,
      stats: {
        updatedCount,
        skippedCount,
        totalProcessed: updatedCount + skippedCount,
        errorCount: errors.length,
      },
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    console.error(
      "Error creating holiday and updating attendance:",
      error.message,
    );
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
      type: error.name,
    });
  }
};

const getBreakInfo = async (req, res) => {
  try {
    // Support both query parameters and request body
    const { attendanceId, date } = req.query || req.body;
    if (!attendanceId || !date) {
      return res
        .status(400)
        .json({ message: "attendanceId and date are required" });
    }
    const attendanceObj = await AttendanceModel.findById(attendanceId);
    if (!attendanceObj)
      return res.status(404).json({ message: "Attendance record not found" });

    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const yearObj = attendanceObj.years.find((y) => y.year === year);
    if (!yearObj) return res.status(404).json({ message: "Year not found" });
    const monthObj = yearObj.months.find((m) => m.month === month);
    if (!monthObj) return res.status(404).json({ message: "Month not found" });
    const dateObj = monthObj.dates.find((d) => d.date === day);
    if (!dateObj) return res.status(404).json({ message: "Date not found" });

    res.status(200).json({
      breakTime: dateObj.breakTime || [],
      resumeTime: dateObj.resumeTime || [],
      totalBrake: dateObj.totalBrake || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// const findAttendance = async (req, res) => {
//   try {
//     // Step 1: Find active employees (not full & final)
//     const activeEmployees = await Employee.find({
//       isFullandFinal: { $ne: "Yes" },
//     }).populate("salary position department");

//     const activeEmployeeIds = activeEmployees.map((emp) => emp._id);

//     // Step 2: Fetch attendance data for those employees
//     const attendanceData = await AttendanceModel.find({
//       employeeObjID: { $in: activeEmployeeIds },
//     })
//       .populate("years.months.dates.shifts")
//       .populate("years.months.dates.holiday")
//       .populate("years.months.dates.LeaveApplication");

//     // Step 3: Map into clean response format
//     const response = activeEmployees.map((user) => {
//       const attendance = attendanceData.find(
//         (att) => att.employeeObjID._id.toString() === user._id.toString()
//       );

//       return {
//         userId: user._id,
//         FirstName: user.FirstName,
//         LastName: user.LastName,
//         empID: user.empID,
//         Account: user.Account,
//         reportManager: user.reportManager,
//         position: user.position?.[0] || null,
//         department: user.department?.[0] || null,
//         profile: user.profile,
//         attendance: attendance || null, // attach attendance object
//       };
//     });

//     res.json(response);
//   } catch (error) {
//     console.error("Error fetching attendance:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const findAttendance = async (req, res) => {
  try {
    // Step 1️⃣ Active employees only
    const activeEmployees = await Employee.find({
      isFullandFinal: { $ne: "Yes" },
    }).select("_id");

    const activeEmployeeIds = activeEmployees.map(emp => emp._id);

    // Step 2️⃣ Attendance fetch
    const attendanceData = await AttendanceModel.find({
      employeeObjID: { $in: activeEmployeeIds },
    })
      .populate({
        path: "employeeObjID",
        select: "FirstName LastName empID Email profile position department salary shifts status",
        populate: [
          { path: "position", select: "name" },
          { path: "department", select: "name" },
          { path: "salary", select: "basic hra gross netSalary" },
          { path: "shifts", select: "shiftName startTime endTime" },
        ],
      })
      .populate({
        path: "years.months.dates.shifts",
        select: "shiftName startTime endTime",
      })
      .populate({
        path: "years.months.dates.holiday",
        select: "name date type",
      })
      .populate({
        path: "years.months.dates.LeaveApplication",
        select: "leaveType fromDate toDate duration status",
      });

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// main working code to find attendance, excluding full and final employees
// const findAttendance = async (req, res) => {
//   try {
//     // Step 1: Find employee IDs where isFullandFinal !== "Yes"
//     const activeEmployees = await Employee.find({
//       isFullandFinal: { $ne: "Yes" },
//     }).select("_id");

//     const activeEmployeeIds = activeEmployees.map((emp) => emp._id);

//     // Step 2: Fetch attendance data only for those employees
//     const attendanceData = await AttendanceModel.find({
//       employeeObjID: { $in: activeEmployeeIds },
//     })
//       .populate({
//         path: "employeeObjID",
//         populate: {
//           path: "salary position department",
//         },
//       })
//       .populate("years.months.dates.shifts")
//       .populate("years.months.dates.holiday")
//       .populate("years.months.dates.LeaveApplication");

//     res.json(attendanceData);
//   } catch (error) {
//     console.error("Error fetching attendance:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getBreakInfoByEmail = async (req, res) => {
  try {
    const { email, date } = req.body;
    if (!email || !date)
      return res.status(400).json({ message: "email and date are required" });

    // Find employee by email
    const employee = await Employee.findOne({
      Email: { $regex: `^${email}$`, $options: "i" },
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const attendanceRecord = await AttendanceModel.findById(
      employee.attendanceObjID,
    );
    if (!attendanceRecord)
      return res
        .status(404)
        .json({ message: "Attendance record not found for employee" });

    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const yearObj = attendanceRecord.years.find((y) => y.year === year);
    if (!yearObj)
      return res.status(404).json({ message: "Year not found in attendance" });
    const monthObj = yearObj.months.find((m) => m.month === month);
    if (!monthObj)
      return res.status(404).json({ message: "Month not found in attendance" });
    const dateObj = monthObj.dates.find((d2) => d2.date === day);
    if (!dateObj)
      return res.status(404).json({ message: "Date not found in attendance" });

    // return break and resume arrays (or empty arrays)
    return res.status(200).json({
      attendanceId: attendanceRecord._id,
      breakTime: dateObj.breakTime || [],
      resumeTime: dateObj.ResumeTime || dateObj.resumeTime || [],
      totalBrake: dateObj.totalBrake || 0,
    });
  } catch (error) {
    console.error("Error in getBreakInfoByEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBreak = async (req, res) => {
  try {
    const { attendanceId, date, breakTime, resumeTime, totalBrake } = req.body;
    if (!attendanceId || !date) {
      return res
        .status(400)
        .json({ message: "attendanceId and date are required" });
    }
    const attendanceObj = await AttendanceModel.findById(attendanceId);
    if (!attendanceObj)
      return res.status(404).json({ message: "Attendance record not found" });

    // Find the correct year, month, and date
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const yearObj = attendanceObj.years.find((y) => y.year === year);
    if (!yearObj) return res.status(404).json({ message: "Year not found" });
    const monthObj = yearObj.months.find((m) => m.month === month);
    if (!monthObj) return res.status(404).json({ message: "Month not found" });
    const dateObj = monthObj.dates.find((d) => d.date === day);
    if (!dateObj) return res.status(404).json({ message: "Date not found" });

    // Update breakTime and resumeTime arrays and compute their millisecond markers
    // Ensure arrays exist
    dateObj.breakTime = dateObj.breakTime || [];
    dateObj.breakTimeMs = dateObj.breakTimeMs || [];
    dateObj.ResumeTime = dateObj.ResumeTime || [];
    dateObj.resumeTimeMS = dateObj.resumeTimeMS || [];
    dateObj.BreakData = dateObj.BreakData || [];

    // Helper to parse time (HH:mm or HH:mm:ss) into minutes since epoch in IST
    const toMinutesForDate = (dateStr, timeStr) => {
      if (!timeStr) return null;
      const formats = ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss"];
      const m = Moment.tz(`${dateStr} ${timeStr}`, formats, "Asia/Kolkata");
      if (!m.isValid()) return null;
      return Math.round(m.valueOf() / 60000);
    };

    if (typeof breakTime !== "undefined" && breakTime !== "") {
      // push break time string
      dateObj.breakTime.push(breakTime);
      const bMs = toMinutesForDate(date, breakTime);
      if (bMs !== null) dateObj.breakTimeMs.push(bMs);
    }

    if (typeof resumeTime !== "undefined" && resumeTime !== "") {
      // push resume time string (use ResumeTime field as in schema)
      dateObj.ResumeTime.push(resumeTime);
      const rMs = toMinutesForDate(date, resumeTime);
      if (rMs !== null) dateObj.resumeTimeMS.push(rMs);
    }

    // Recompute BreakData and totalBrake whenever break or resume arrays changed
    {
      const breaks = (dateObj.breakTimeMs || [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v));
      const resumes = (dateObj.resumeTimeMS || [])
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v));
      const pairs = Math.min(breaks.length, resumes.length);
      const newBreakData = [];
      for (let i = 0; i < pairs; i++) {
        const diff = resumes[i] - breaks[i];
        if (Number.isFinite(diff) && diff >= 0) newBreakData.push(diff);
      }
      dateObj.BreakData = newBreakData;
      dateObj.totalBrake = newBreakData.reduce((sum, v) => sum + v, 0);
    }

    // If client provided totalBrake explicitly, allow override (but ensure numeric)
    if (typeof totalBrake !== "undefined" && totalBrake !== "") {
      const n = Number(totalBrake);
      if (Number.isFinite(n)) dateObj.totalBrake = n;
    }
    attendanceObj.markModified("years");
    await attendanceObj.save();
    res
      .status(200)
      .json({ message: "Break/Resume/Total Break updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const findEmployeeAttendanceId = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Check employee is active (not Full & Final)
    const employee = await Employee.findOne({
      _id: id,
      isFullandFinal: { $ne: "Yes" },
    });

    if (!employee) {
      return res.status(404).json({
        error: "Active employee not found or already marked Full and Final",
      });
    }

    // 2️⃣ Fetch ONLY this employee's attendance
    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
    }).populate(
      "years.months.dates.shifts years.months.dates.holiday years.months.dates.LeaveApplication",
    );

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ error: "Attendance record not found for the user" });
    }

    // 3️⃣ Return ONLY required employee data + attendance
    const responseData = {
      userId: employee._id,
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      empID: employee.empID,
      Account: employee.Account,
      reportManager: employee.reportManager || null,
      reportHr: employee.reportHr || null,
      position: employee.position?.[0] || null,
      department: employee.department?.[0] || null,
      profile: employee.profile || null,

      // FULL attendance object (only for this user)
      attendance: attendanceRecord,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const MonthlyLogSummary = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { year, month, viewMode } = req.query;

    const currentYear = Number(year) || new Date().getFullYear();
    const currentMonth = Number(month) || new Date().getMonth() + 1;

    // 1️⃣ Check active employee
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    }).select("FirstName LastName empID Account");

    if (!employee) {
      return res.status(404).json({ error: "Active employee not found" });
    }

    // 2️⃣ Fetch attendance ONLY for this employee
    const attendance = await AttendanceModel.findOne(
      { employeeObjID: employeeId },
      { years: 1 },
    ).lean();

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    const yearObj = attendance.years?.find(
      (y) => Number(y.year) === currentYear,
    );

    let grossLogin = 0;
    let totalBreak = 0;
    let netLogin = 0;

    // 3️⃣ Monthly summary
    if (viewMode === "monthly") {
      const monthObj = yearObj?.months?.find(
        (m) => Number(m.month) === currentMonth,
      );

      monthObj?.dates?.forEach((d) => {
        grossLogin += Number(d.TotalLogin || 0);
        totalBreak += Number(d.totalBrake || 0);
        netLogin += Number(d.totalLogAfterBreak || 0);
      });
    }

    // 4️⃣ Yearly summary
    if (viewMode === "yearly") {
      yearObj?.months?.forEach((m) => {
        m.dates?.forEach((d) => {
          grossLogin += Number(d.TotalLogin || 0);
          totalBreak += Number(d.totalBrake || 0);
          netLogin += Number(d.totalLogAfterBreak || 0);
        });
      });
    }

    // 5️⃣ Send SMALL & CLEAN response
    res.status(200).json({
      // employee: {
      //   id: employee._id,
      //   name: `${employee.FirstName} ${employee.LastName}`,
      //   empID: employee.empID,
      //   account: employee.Account,
      // },
      summary: {
        viewMode,
        year: currentYear,
        month: viewMode === "monthly" ? currentMonth : null,
        grossLogin,
        totalBreak,
        netLogin,
      },
    });
  } catch (error) {
    console.error("Attendance summary error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const findEmployeeAttendanceEployeeId = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Check employee and ensure isFullandFinal is not "Yes"
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    });

    if (!employee) {
      console.log(`Active employee not found for ID: ${employeeId}`);
      return res.status(404).json({
        error: "Active employee not found or already marked Full and Final",
      });
    }

    // Fetch FULL attendance record with populated shifts/leave/holidays
    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
    }).populate(
      "years.months.dates.shifts years.months.dates.holiday years.months.dates.LeaveApplication",
    );

    if (!attendanceRecord) {
      console.log(`No attendance record found for employee ID: ${employeeId}`);
      return res
        .status(404)
        .json({ error: "Attendance record not found for the user" });
    }

    // Get current IST date info
    const currentISTDate = Moment.tz("Asia/Kolkata");
    const currentYear = currentISTDate.year();
    const currentMonth = currentISTDate.month() + 1; // Convert to 1-based
    const currentDay = currentISTDate.date();

    // Find today's record (gracefully return null if not found, don't fail)
    let todayRecord = null;
    const yearRecord = attendanceRecord.years.find(
      (year) => year.year === currentYear,
    );

    if (yearRecord) {
      const monthRecord = yearRecord.months.find(
        (month) => month.month === currentMonth,
      );

      if (monthRecord) {
        todayRecord = monthRecord.dates.find(
          (date) => date.date === currentDay,
        );
      }
    }

    // Return full attendance + today's record (if available)
    res.status(200).json({
      userId: employee._id,
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      empID: employee.empID,
      Account: employee.Account,
      reportManager: employee.reportManager || null,
      reportHr: employee.reportHr || null,
      position: employee.position?.[0] || null,
      department: employee.department?.[0] || null,
      profile: employee.profile || null,

      // FULL attendance object (all years/months/dates with populated shifts/leave)
      // attendance: attendanceRecord,

      // Today's record (if available, else null)
      today: todayRecord || null,
      attendanceID: attendanceRecord._id,
      month: currentMonth,
      year: currentYear,
    });
  } catch (error) {
    console.error("Error fetching attendance data by employee ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const DashboardLogButton = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    }).select("_id");

    if (!employee) {
      return res.status(404).json({
        error: "Active employee not found or marked Full & Final",
      });
    }

    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
    }).select("_id years");

    if (!attendanceRecord) {
      return res.status(404).json({
        error: "Attendance record not found",
      });
    }

    const now = Moment.tz("Asia/Kolkata");
    const year = now.year();
    const month = now.month() + 1;
    const day = now.date();

    let todayStatus = null;

    const yearBlock = attendanceRecord.years.find((y) => y.year === year);
    if (yearBlock) {
      const monthBlock = yearBlock.months.find((m) => m.month === month);
      if (monthBlock) {
        const dateBlock = monthBlock.dates.find((d) => d.date === day);
        if (dateBlock) {
          todayStatus = dateBlock.status || "logout";
        }
      }
    }

    return res.status(200).json({
      attendanceID: attendanceRecord._id,
      today: todayStatus ? { status: todayStatus } : null,
    });
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// find all holidays

const findAllHolidays = async (req, res) => {
  try {
    const allHolidays = await Holiday.find();
    res.status(200).json(allHolidays);
  } catch (error) {
    console.error("Error fetching holiday data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHolidaysByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and Month are required" });
    }

    const holidays = await Holiday.find({
      holidayYear: Number(year),
      holidayMonth: Number(month),
    }).sort({ holidayDate: 1 });

    res.status(200).json(holidays);
  } catch (error) {
    console.error("Holiday month fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Holiday ID is required" });
    }

    const holiday = await Holiday.findById(id);

    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    await Holiday.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Holiday deleted successfully",
      deletedHoliday: holiday,
    });
  } catch (error) {
    console.error("Delete Holiday Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// slow code
const attendanceRegister = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { search = "", page = 1, limit = 200 } = req.query;

    const filterYear = parseInt(year);
    const filterMonth = parseInt(month);
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);

    if (!filterYear || !filterMonth) {
      return res.status(400).json({ error: "Year and Month are required" });
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
    const searchRegex = new RegExp(search, "i");

    // Employees list with search + pagination
    const employeesQuery = {
      isFullandFinal: { $ne: "Yes" },
      $or: [
        { FirstName: searchRegex },
        { LastName: searchRegex },
        { empID: searchRegex },
      ],
    };

    const [users, totalUsers] = await Promise.all([
      Employee.find(employeesQuery, {
        FirstName: 1,
        LastName: 1,
        empID: 1,
        Account: 1,
        reportManager: 1,
        position: 1,
        department: 1,
        profile: 1,
        status: 1,
        PANcardNo: 1,
        UANNumber: 1,
        BankName: 1,
        BankAccount: 1,
        BankIFSC: 1,
        salary: 1, // ✅ ADD THIS
      })
        .populate("salary") // ✅ ADD IF salary ref schema

        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Employee.countDocuments(employeesQuery),
    ]);

    const userIds = users.map((u) => u._id);

    // Attendance limited to requested year/month, with rich leave populate
    const attendanceRecords = await AttendanceModel.find(
      {
        employeeObjID: { $in: userIds },
        "years.year": filterYear,
        "years.months.month": filterMonth,
      },
      { employeeObjID: 1, years: 1 },
    )
      .populate(
        "years.months.dates.holiday",
        "holidayName holidayType",
        "Department",
      )
      .populate(
        "years.months.dates.LeaveApplication",
        "Leavetype leaveDuration reason status appliedOn approvedOn fromDate toDate employeeObjID updatedBy",
      )

      .populate("salary")

      .populate("years.months.dates.shifts", "name startTime endTime")
      .lean();

    // Dropdown (available years/months for the selected users)
    const dropdownAgg = await AttendanceModel.aggregate([
      { $match: { employeeObjID: { $in: userIds } } },
      { $unwind: "$years" },
      { $unwind: "$years.months" },
      {
        $group: {
          _id: null,
          years: { $addToSet: "$years.year" },
          months: { $addToSet: "$years.months.month" },
        },
      },
      {
        $project: {
          _id: 0,
          years: { $setDifference: ["$years", [null]] },
          months: { $setDifference: ["$months", [null]] },
        },
      },
    ]);

    const availableYears = (dropdownAgg[0]?.years || []).sort((a, b) => a - b);
    const availableMonths = (dropdownAgg[0]?.months || []).sort(
      (a, b) => a - b,
    );

    // Map attendance by employee
    const attendanceMap = new Map();
    attendanceRecords.forEach((record) => {
      attendanceMap.set(String(record.employeeObjID), record.years);
    });

    // Build response per user
    const result = users.map((user) => {
      const yearsData = attendanceMap.get(String(user._id));

      const attendance = yearsData
        ? yearsData
          .filter((y) => y.year === filterYear)
          .map((y) => ({
            year: y.year,
            months: y.months
              .filter((m) => m.month === filterMonth)
              .map((monthData) => {
                const dates = [];

                for (let day = 1; day <= daysInMonth; day++) {
                  const dateData = monthData.dates?.find(
                    (d) => d.date === day,
                  );

                  // Effective loginTime for markAttendance
                  let effectiveLoginTime = dateData?.loginTime || [];
                  if (dateData?.holiday) {
                    effectiveLoginTime = "HD";
                  } else {
                    const dayOfWeek = new Date(
                      y.year,
                      monthData.month - 1,
                      day,
                    ).getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const isPast =
                      y.year < currentYear ||
                      (y.year === currentYear &&
                        monthData.month < currentMonth) ||
                      (y.year === currentYear &&
                        monthData.month === currentMonth &&
                        day < currentDay);
                    if (isWeekend && isPast) {
                      effectiveLoginTime = "WO";
                    }
                  }

                  const calc = markAttendance({
                    loginTime: effectiveLoginTime,
                    day,
                    month: monthData.month,
                    year: y.year,
                    shifts: dateData?.shifts || null,

                    isNCNS: !!dateData?.isNCNS,
                    isOnLeave: !!dateData?.isOnLeave,
                    isSandwhich: !!dateData?.isSandwhich, // ✅ FIXED
                    isForcedAbsent: !!dateData?.isForcedAbsent,

                    LeaveDurationName:
                      dateData?.LeaveApplication?.leaveDuration || "",
                    LeaveTypeName:
                      dateData?.LeaveApplication?.Leavetype || "",

                    netLogiHours: Number(dateData?.totalLogAfterBreak || 0),
                    loginTimeLength: dateData?.loginTime?.length || 0,
                    logoutTimeLength: dateData?.logoutTime?.length || 0,
                  });

                  dates.push({
                    date: day,
                    day:
                      dateData?.day ||
                      new Date(
                        y.year,
                        monthData.month - 1,
                        day,
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                      }),

                    status: calc.status,
                    color: calc.color,
                    title: calc.title,

                    loginTime: dateData?.loginTime || [],
                    logoutTime: dateData?.logoutTime || [],
                    totalLogAfterBreak: dateData?.totalLogAfterBreak || 0,

                    isOnLeave: !!dateData?.isOnLeave,

                    shifts: dateData?.shifts
                      ? {
                        name: dateData.shifts.name,
                        startTime: dateData.shifts.startTime,
                        endTime: dateData.shifts.endTime,
                      }
                      : null,

                    holiday: dateData?.holiday
                      ? {
                        name: dateData.holiday.holidayName,
                        type: dateData.holiday.holidayType,
                      }
                      : null,

                    leave: dateData?.LeaveApplication || null,

                    // ✅ ADD THESE
                    isNCNS: !!dateData?.isNCNS,
                    isSandwhich: !!dateData?.isSandwhich,
                    isForcedAbsent: !!dateData?.isForcedAbsent,
                  });
                }

                // ---------------- COUNTS ----------------
                const presentCount = dates.filter(
                  (d) => d.status === "P",
                ).length;
                const weekoffCount = dates.filter(
                  (d) => d.status === "W",
                ).length;
                const holidayCount = dates.filter(
                  (d) => d.status === "O",
                ).length;

                const fullPaidLeaveCount = dates.filter(
                  (d) => d.status === "VF",
                ).length;
                const halfPaidLeaveCount = dates.filter(
                  (d) => d.status === "VH",
                ).length;

                const fullUnpaidLeaveCount = dates.filter(
                  (d) => d.status === "UF",
                ).length;
                const halfUnpaidLeaveCount = dates.filter(
                  (d) => d.status === "UH",
                ).length;

                const halfDayCount = dates.filter(
                  (d) => d.status === "H",
                ).length;

                const sandwichCount = dates.filter(
                  (d) => d.status === "S",
                ).length;
                const ncnsCount = dates.filter(
                  (d) => d.status === "N",
                ).length;

                const absentCount = dates.filter((d) =>
                  ["A", "--"].includes(d.status),
                ).length;

                // ---------------- TOTALS ----------------
                const totals = {
                  totalDays: daysInMonth,

                  present: presentCount + halfPaidLeaveCount / 2,

                  absent: absentCount,

                  weekoff: weekoffCount,
                  holiday: holidayCount,
                  halfday: halfDayCount,

                  paidLeaves: fullPaidLeaveCount + halfPaidLeaveCount / 2,

                  unpaidLeaves:
                    fullUnpaidLeaveCount + halfUnpaidLeaveCount / 2,

                  NCNS: ncnsCount,
                  Sandwich: sandwichCount,

                  // ---------------- PAYABLE DAYS ----------------
                  totalPayableDays: Math.max(
                    presentCount +
                    weekoffCount +
                    holidayCount +
                    fullPaidLeaveCount +
                    halfPaidLeaveCount / 2 +
                    halfDayCount / 2 -
                    // ❌ DOUBLE DEDUCTION RULE
                    sandwichCount * 2 -
                    ncnsCount * 2,
                    0,
                  ),
                };


                return { month: monthData.month, dates, totals };
              }),
          }))
        : null;

      return {
        userId: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        empID: user.empID,
        Account: user.Account,
        salary: user.salary, // ✅ pass salary

        employeeobjID: user._id, // ✅ ADD THIS
        reportManager: user.reportManager,
        position: user.position?.[0] || null,
        department: user.department?.[0] || null,
        profile: user.profile,
        status: user.status,
        PANcardNo: user.PANcardNo,
        UANNumber: user.UANNumber,
        BankName: user.BankName,
        BankAccount: user.BankAccount,
        BankIFSC: user.BankIFSC,
        attendance,
      };
    });

    return res.status(200).json({
      attendance: result,
      availableYears,
      availableMonths,
      pagination: {
        totalUsers,
        currentPage: pageNum,
        totalPages: Math.ceil(totalUsers / pageSize),
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance register:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const todaysAttendance = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // Optional filters from query params
    const { page = 1, limit = 100, department } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit) || 100)); // cap at 500
    const skip = (pageNum - 1) * limitNum;

    // Step 1: Build employee filter
    const employeeFilter = {
      status: "active",
      isFullandFinal: { $ne: "Yes" },
    };
    if (department) {
      employeeFilter.department = department; // Filter by department if provided
    }

    // Step 2: Fetch employees with minimal fields + attendance ID only (no population)
    const users = await Employee.find(employeeFilter)
      .select(
        "_id FirstName LastName empID Account reportManager shifts profile position department attendanceObjID",
      )
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for faster query

    if (!users || users.length === 0) {
      return res
        .status(200)
        .json({ data: [], page: pageNum, limit: limitNum, total: 0 });
    }

    const attendanceObjIds = users
      .map((u) => u.attendanceObjID)
      .filter((id) => id);

    // Step 3: Fetch ONLY today's attendance using MongoDB aggregation
    // This is much faster than populating entire nested structure
    const todayAttendance = await AttendanceModel.aggregate([
      {
        $match: {
          _id: { $in: attendanceObjIds },
          "years.year": currentYear,
          "years.months.month": currentMonth,
          "years.months.dates.date": currentDay,
        },
      },
      // Unwind nested arrays to reach the specific date object
      { $unwind: "$years" },
      { $match: { "years.year": currentYear } },
      { $unwind: "$years.months" },
      { $match: { "years.months.month": currentMonth } },
      { $unwind: "$years.months.dates" },
      { $match: { "years.months.dates.date": currentDay } },

      // Lookup associated shift document (if any)
      {
        $lookup: {
          from: "shifts",
          localField: "years.months.dates.shifts",
          foreignField: "_id",
          as: "shiftDoc",
        },
      },
      { $unwind: { path: "$shiftDoc", preserveNullAndEmptyArrays: true } },

      // Lookup associated leave application (if any)
      {
        $lookup: {
          from: "leaveapplications",
          localField: "years.months.dates.LeaveApplication",
          foreignField: "_id",
          as: "leaveApp",
        },
      },
      { $unwind: { path: "$leaveApp", preserveNullAndEmptyArrays: true } },

      // Project a compact attendance object and embed populated docs
      {
        $project: {
          employeeObjID: 1,
          attendance: {
            $mergeObjects: [
              "$years.months.dates",
              { shifts: "$shiftDoc", LeaveApplication: "$leaveApp" },
            ],
          },
        },
      },
    ]);

    // Step 4: Build a map of attendance by employeeObjID for quick lookup
    const attendanceMap = new Map();
    for (const record of todayAttendance) {
      attendanceMap.set(record.employeeObjID.toString(), record.attendance);
    }

    // Step 5: Combine employee data with their today's attendance
    const attendanceData = users.map((user) => ({
      userId: user._id,
      FirstName: user.FirstName,
      LastName: user.LastName,
      empID: user.empID,
      Account: user.Account,
      reportManager: user.reportManager,
      position: user.position?.[0] || null,
      department: user.department?.[0] || null,
      attendance: attendanceMap.get(user._id.toString()) || null,
      profile: user.profile,
    }));

    // Step 6: Get total count for pagination
    const totalCount = await Employee.countDocuments(employeeFilter);

    res.status(200).json({
      data: attendanceData,
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      hasMore: skip + limitNum < totalCount,
    });
  } catch (error) {
    console.error("Error fetching today's attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const dashboardAttendance = async (req, res) => {
  try {
    // 🔐 Logged-in user from JWT
    const { _id, Account, Email } = req.user;

    // 🚫 Employees have no permission
    if (Account === 3) {
      return res.status(403).json({
        message: "You are not permitted",
      });
    }

    // 📅 Today
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    // 🔍 Base filter
    let employeeFilter = {
      status: "active",
      isFullandFinal: { $ne: "Yes" },
    };

    // 👑 Admin → all except self
    if (Account === 1) {
      employeeFilter._id = { $ne: new mongoose.Types.ObjectId(_id) };
    }

    // 🧑‍💼 HR → all except admin & self
    if (Account === 2) {
      employeeFilter.Account = { $ne: 1 };
      employeeFilter._id = { $ne: new mongoose.Types.ObjectId(_id) };
    }

    // 👨‍💼 Manager → only reporting employees
    if (Account === 4) {
      const me = await Employee.findById(_id).select("Email").lean();

      if (!me?.Email) {
        return res.status(400).json({ message: "User email not found" });
      }

      employeeFilter.reportManager = me.Email.toLowerCase().trim();
    }

    // 👥 Fetch employees (DO NOT filter by attendance)
    const users = await Employee.find(employeeFilter)
      .select(
        "FirstName LastName department profile attendanceObjID Email Account reportManager",
      )
      .populate("department", "DepartmentName")
      .lean();

    if (!users.length) {
      return res.json([]);
    }

    // 🆔 Attendance Object IDs (may be fewer than users)
    const attendanceIds = users.map((u) => u.attendanceObjID).filter(Boolean);

    // 📊 Attendance aggregation (NO date filter here)
    let attendanceData = [];

    if (attendanceIds.length) {
      attendanceData = await AttendanceModel.aggregate([
        {
          $match: {
            _id: { $in: attendanceIds },
          },
        },
        { $unwind: "$years" },
        { $match: { "years.year": year } },
        { $unwind: "$years.months" },
        { $match: { "years.months.month": month } },
        { $unwind: "$years.months.dates" },
        { $match: { "years.months.dates.date": date } },

        {
          $lookup: {
            from: "shifts",
            localField: "years.months.dates.shifts",
            foreignField: "_id",
            as: "shift",
          },
        },
        { $unwind: { path: "$shift", preserveNullAndEmptyArrays: true } },

        {
          $project: {
            employeeObjID: 1,
            loginTime: "$years.months.dates.loginTime",
            status: "$years.months.dates.status",
            shiftStart: "$shift.startTime",
          },
        },
      ]);
    }

    // ⚡ Map attendance by employee
    const attendanceMap = new Map();
    attendanceData.forEach((att) => {
      attendanceMap.set(att.employeeObjID.toString(), att);
    });

    // 🧾 Final response (NO USER DROPPED)
    const response = users.map((user) => {
      const att = attendanceMap.get(user._id.toString());

      return {
        userId: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        department: user.department,
        profile: user.profile,
        attendance: att
          ? {
            loginTime: att.loginTime,
            status: att.status,
            shifts: {
              startTime: att.shiftStart,
            },
          }
          : {
            loginTime: [],
            status: "absent",
            shifts: null,
          },
      };
    });

    return res.json(response);
  } catch (error) {
    console.error("Dashboard Attendance Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const todaysTeamAttendance = async (req, res) => {
  try {
    const managerID = req.user._id;

    // 1️⃣ Fetch manager email
    const manager = await Employee.findById(managerID).select("Email").lean();
    const managerEmail = manager?.Email;
    if (!managerEmail) {
      return res.status(404).json({ error: "Manager not found" });
    }

    // 2️⃣ Today
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    // 3️⃣ Load team employees
    const employees = await Employee.find({
      status: "active",
      isFullandFinal: "No",
      reportManager: managerEmail,
    })
      .select(
        "FirstName LastName Email Account reportManager position shifts profile attendanceObjID",
      )
      .populate({
        path: "position",
        select: "PositionName",
      })
      .populate({
        path: "shifts",
        select: "name shiftName startTime start_time endTime end_time",
      })
      .lean();

    if (!employees.length) return res.status(200).json([]);

    const attendanceIds = employees
      .map((e) => e.attendanceObjID)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    let todayAttendance = [];

    if (attendanceIds.length) {
      todayAttendance = await AttendanceModel.aggregate([
        { $match: { _id: { $in: attendanceIds } } },

        { $unwind: "$years" },
        { $match: { "years.year": year } },

        { $unwind: "$years.months" },
        { $match: { "years.months.month": month } },

        { $unwind: "$years.months.dates" },
        { $match: { "years.months.dates.date": date } },

        {
          $project: {
            empId: "$employeeObjID",

            loginTime: {
              $cond: [
                { $gt: [{ $size: "$years.months.dates.loginTime" }, 0] },
                { $arrayElemAt: ["$years.months.dates.loginTime", 0] },
                null,
              ],
            },

            logoutTime: {
              $cond: [
                { $gt: [{ $size: "$years.months.dates.logoutTime" }, 0] },
                {
                  $arrayElemAt: [
                    "$years.months.dates.logoutTime",
                    {
                      $subtract: [
                        { $size: "$years.months.dates.logoutTime" },
                        1,
                      ],
                    },
                  ],
                },
                null,
              ],
            },

            status: { $ifNull: ["$years.months.dates.LogStatus", "--"] },
          },
        },
      ]);
    }

    // 5️⃣ Map attendance by employee ID
    const attendanceMap = {};
    todayAttendance.forEach((a) => {
      if (a.empId) attendanceMap[a.empId.toString()] = a;
    });

    // 6️⃣ Shift normalizer
    const normalizeShift = (shift) => {
      if (!shift) return null;
      return {
        name: shift.name || shift.shiftName || null,
        startTime: shift.startTime || shift.start_time || null,
        endTime: shift.endTime || shift.end_time || null,
      };
    };

    // 7️⃣ Final response
    const result = employees.map((emp) => {
      const attendanceData =
        attendanceMap[emp.attendanceObjID?.toString()] || null;

      const employeeShift = emp.shifts?.length
        ? normalizeShift(emp.shifts[0])
        : null;

      const attendanceShift = attendanceData?.shift || null;
      const finalShift = attendanceShift || employeeShift;

      // ✅ Multi-position safe
      const positionName =
        Array.isArray(emp.position) && emp.position.length
          ? emp.position.map((p) => p.PositionName).join(", ")
          : "Not Assigned";

      return {
        userId: emp._id,
        FirstName: emp.FirstName,
        LastName: emp.LastName,
        Email: emp.Email,
        Account: emp.Account,
        reportManager: emp.reportManager,

        position: positionName,

        shift: {
          name: finalShift?.name || null,
          startTime: finalShift?.startTime || null,
          endTime: finalShift?.endTime || null,
        },

        profile: emp.profile || { image_url: "" },

        attendance: {
          loginTime: attendanceData?.loginTime || null,
          logStatus: attendanceData?.logStatus || "--",
        },
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("todaysTeamAttendance error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEmployeeTodayAttendance = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Step 1: Fetch employee with minimal fields
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    })
      .select(
        "_id FirstName LastName empID Account reportManager shifts profile position department attendanceObjID",
      )
      .lean();

    if (!employee) {
      return res
        .status(404)
        .json({ error: "Employee not found or marked Full and Final" });
    }

    // Step 2: Get current date info
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // Step 3: Fetch today's attendance using MongoDB aggregation (optimized)
    const todayAttendanceResult = await AttendanceModel.aggregate([
      {
        $match: {
          _id: employee.attendanceObjID,
          "years.year": currentYear,
          "years.months.month": currentMonth,
          "years.months.dates.date": currentDay,
        },
      },
      // Unwind nested arrays to reach the specific date object
      { $unwind: "$years" },
      { $match: { "years.year": currentYear } },
      { $unwind: "$years.months" },
      { $match: { "years.months.month": currentMonth } },
      { $unwind: "$years.months.dates" },
      { $match: { "years.months.dates.date": currentDay } },

      // Lookup associated shift document
      {
        $lookup: {
          from: "shifts",
          localField: "years.months.dates.shifts",
          foreignField: "_id",
          as: "shiftDoc",
        },
      },
      { $unwind: { path: "$shiftDoc", preserveNullAndEmptyArrays: true } },

      // Lookup associated leave application
      {
        $lookup: {
          from: "leaveapplications",
          localField: "years.months.dates.LeaveApplication",
          foreignField: "_id",
          as: "leaveApp",
        },
      },
      { $unwind: { path: "$leaveApp", preserveNullAndEmptyArrays: true } },

      // Project attendance with populated docs
      {
        $project: {
          employeeObjID: 1,
          attendance: {
            $mergeObjects: [
              "$years.months.dates",
              { shifts: "$shiftDoc", LeaveApplication: "$leaveApp" },
            ],
          },
        },
      },
    ]);

    // Step 4: Get today's attendance data (gracefully return null if not found)
    const todayAttendance =
      todayAttendanceResult.length > 0
        ? todayAttendanceResult[0].attendance
        : null;

    // Step 5: Format response with full employee data + today's attendance
    const attendanceData = {
      userId: employee._id,
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      empID: employee.empID,
      Account: employee.Account,
      reportManager: employee.reportManager || null,
      position: employee.position?.[0] || null,
      department: employee.department?.[0] || null,
      profile: employee.profile || null,
      attendance: todayAttendance,
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    };

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance for employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const mytodaylogs = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // 1️⃣ Only get attendance object id
    const employee = await Employee.findOne(
      { _id: employeeId, isFullandFinal: { $ne: "Yes" } },
      { attendanceObjID: 1 },
    ).lean();

    if (!employee?.attendanceObjID) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // 2️⃣ Extract only today’s node
    const result = await AttendanceModel.aggregate([
      { $match: { _id: employee.attendanceObjID } },

      { $unwind: "$years" },
      { $match: { "years.year": year } },

      { $unwind: "$years.months" },
      { $match: { "years.months.month": month } },

      { $unwind: "$years.months.dates" },
      { $match: { "years.months.dates.date": day } },

      {
        $project: {
          _id: 0,

          loginTime: {
            $arrayElemAt: ["$years.months.dates.loginTime", 0],
          },

          logoutTime: {
            $arrayElemAt: [
              "$years.months.dates.logoutTime",
              { $subtract: [{ $size: "$years.months.dates.logoutTime" }, 1] },
            ],
          },

          totalBrake: {
            $ifNull: ["$years.months.dates.totalBrake", 0],
          },

          totalLoginTime: {
            $ifNull: [
              "$years.months.dates.TotalLogin",
              "$years.months.dates.totalLogAfterBreak",
            ],
          },

          status: {
            $ifNull: ["$years.months.dates.LogStatus", "--"],
          },
        },
      },
    ]);

    if (!result.length) {
      return res.status(200).json({
        loginTime: "—",
        logoutTime: "—",
        totalBrake: 0,
        totalLoginTime: 0,
        status: "--",
      });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Today log error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTodaysAttendanceStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized: User not found." });

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JS months are 0-indexed
    const date = today.getDate();
    const day = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Find attendance document for the user
    const attendance = await AttendanceModel.findOne({
      employeeObjID: userId,
    }).lean();

    if (!attendance) return res.json({ status: "logout" });

    // Find today's data inside the nested arrays
    const yearData = attendance.years.find((y) => y.year === year);
    if (!yearData) return res.json({ status: "logout" });

    const monthData = yearData.months.find((m) => m.month === month);
    if (!monthData) return res.json({ status: "logout" });

    const dateData = monthData.dates.find((d) => d.date === date);
    if (!dateData) return res.json({ status: "logout" });

    // Return only the relevant data
    res.json({
      status: dateData.status, // login, logout, or other
    });
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTodaysAttendanceMinimal = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // 1️⃣ Fetch employee basic info
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    }).select("_id FirstName Account");

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // 2️⃣ Get today's date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // JS month is 0-indexed
    const currentDay = today.getDate();

    // 3️⃣ Fetch attendance for today only
    const attendanceResult = await AttendanceModel.aggregate([
      { $match: { employeeObjID: employee._id } },
      { $unwind: "$years" },
      { $match: { "years.year": currentYear } },
      { $unwind: "$years.months" },
      { $match: { "years.months.month": currentMonth } },
      { $unwind: "$years.months.dates" },
      { $match: { "years.months.dates.date": currentDay } },
      {
        $project: {
          _id: 0,
          loginTime: "$years.months.dates.loginTime",
          logoutTime: "$years.months.dates.logoutTime",
          totalBrake: "$years.months.dates.totalBrake",
          totalLogAfterBreak: "$years.months.dates.totalLogAfterBreak",
        },
      },
    ]);

    const attendance = attendanceResult[0] || null;

    // 4️⃣ Send minimal response
    res.status(200).json({
      FirstName: employee.FirstName,
      Account: employee.Account,
      attendance,
    });
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { Email, date, loginTime, logoutTime, remark, updatedBy } = req.body;

    // Extract year, month, and day from the provided date
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();

    // Find the employee by their Email
    const attendance = await Employee.findOne({ Email: Email });
    if (!attendance)
      return res.status(404).json({ message: "Employee not found" });

    // Find the attendance object by ID
    const attendanceObj = await AttendanceModel.findById(
      attendance.attendanceObjID,
    );
    if (!attendanceObj)
      return res.status(404).json({ message: "Attendance record not found" });

    // Find the correct year, month, and date
    const yearObj = attendanceObj.years.find((y) => y.year === year);
    if (!yearObj) return res.status(404).json({ message: "Year not found" });

    const monthObj = yearObj.months.find((m) => m.month === month);
    if (!monthObj) return res.status(404).json({ message: "Month not found" });

    const dateObj = monthObj.dates.find((d) => d.date === day);
    if (!dateObj) return res.status(404).json({ message: "Date not found" });

    const currentTimeMs = Math.round(
      Moment().tz("Asia/Kolkata").valueOf() / 1000 / 60,
    );
    const currentTime = Moment().tz("Asia/Kolkata").format("HH:mm:ss");

    // Update the login time, logout time, and remark
    if (loginTime) {
      dateObj.loginTime[0] = loginTime;
      dateObj.loginTimeMs[0] = Math.round(
        new Date(`${date}T${loginTime}`).getTime() / 1000 / 60,
      );
    }

    if (logoutTime) {
      const lastIndex = dateObj.logoutTime.length - 1;
      if (lastIndex < 0) {
        dateObj.logoutTime.push(logoutTime);
        dateObj.logoutTimeMs.push(
          Math.round(new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60),
        );
      } else {
        dateObj.logoutTime[lastIndex] = logoutTime;
        dateObj.logoutTimeMs[lastIndex] = Math.round(
          new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60,
        );
      }
    }

    // Recalculate LogData and Total Login Time
    const loginTimeNew = dateObj.loginTimeMs;
    const logoutimeNew = dateObj.logoutTimeMs;

    const LogData = logoutimeNew.map((val, i) => {
      let login = loginTimeNew[i] || 0; // Ensure login time is valid
      return val - login;
    });

    dateObj.LogData = LogData;
    dateObj.TotalLogin = LogData.reduce((sum, value) => sum + value, 0);
    dateObj.totalLogAfterBreak = dateObj.TotalLogin - (dateObj.totalBrake || 0);

    // Update other fields
    dateObj.updatedBy = updatedBy;
    dateObj.remark = remark;

    // Mark fields as modified
    attendanceObj.markModified("years");

    // Save the updated attendance document
    await attendanceObj.save();

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const markBreak = async (req, res) => {
  try {
    const { employeeObjID, currentDate } = req.body;

    // Find the attendance record for the employee
    const attendance = await AttendanceModel.findOne({
      employeeObjID,
      "years.months.dates.date": currentDate,
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Locate the specific date object
    const dateObj = attendance.years
      .flatMap((year) => year.months)
      .flatMap((month) => month.dates)
      .find((date) => date.date === currentDate);

    if (!dateObj) {
      return res.status(404).json({ message: "Date object not found" });
    }

    // Check if the user is logged in
    if (dateObj.status === "login") {
      // Mark break and update fields
      dateObj.status = "break";
      dateObj.breakTime.push(new Date().toISOString());
      dateObj.breakTimeMs.push(Date.now());
      dateObj.BreakData.push("No activity detected");

      await attendance.save();

      return res
        .status(200)
        .json({ message: "Break marked due to inactivity" });
    }

    res
      .status(400)
      .json({ message: "User is not logged in or already on break" });
  } catch (error) {
    console.error("Error marking break:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAttendanceStatus = async (req, res) => {
  try {
    const {
      employeeObjID,
      year,
      month,
      date,
      isNCNS,
      isSandwhich,
      isForcedAbsent,
    } = req.body;

    // Validate input types
    if (
      !employeeObjID ||
      !year ||
      !month ||
      !date ||
      typeof isNCNS !== "boolean" ||
      typeof isSandwhich !== "boolean" ||
      typeof isForcedAbsent !== "boolean"
    ) {
      return res.status(400).json({
        message: "Invalid input data. All flags must be boolean.",
      });
    }

    // Ensure only one flag is true at a time
    const trueCount = [isNCNS, isSandwhich, isForcedAbsent].filter(
      Boolean,
    ).length;
    if (trueCount > 1) {
      return res.status(400).json({
        message:
          "Only one of isNCNS, isSandwhich, or isForcedAbsent can be true at a time.",
      });
    }

    // Find the attendance document
    const attendance = await AttendanceModel.findOne({ employeeObjID });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    // Navigate to the correct year
    const yearRecord = attendance.years.find((y) => y.year === year);
    if (!yearRecord) {
      return res.status(404).json({ message: "Year not found in attendance." });
    }

    // Navigate to the correct month
    const monthRecord = yearRecord.months.find((m) => m.month === month);
    if (!monthRecord) {
      return res
        .status(404)
        .json({ message: "Month not found in attendance." });
    }

    // Navigate to the correct date
    const dateRecord = monthRecord.dates.find((d) => d.date === date);
    if (!dateRecord) {
      return res.status(404).json({ message: "Date not found in attendance." });
    }

    // Update flags
    dateRecord.isNCNS = isNCNS;
    dateRecord.isSandwhich = isSandwhich;
    dateRecord.isForcedAbsent = isForcedAbsent;

    // Save the changes
    await attendance.save();

    res.status(200).json({
      message: "Attendance status updated successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Error updating attendance status:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const getWorkingHoursSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await AttendanceModel.findOne({
      employeeObjID: employeeId,
    });
    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found." });
    }

    const now = Moment().tz("Asia/Kolkata");
    const currentYear = now.year();
    const currentMonth = now.month() + 1; // Moment months are 0-indexed
    const currentWeek = now.isoWeek();

    let monthlyHours = 0;
    let weeklyHours = 0;
    let expectedMonthlyMinutes = 0;
    let expectedWeeklyMinutes = 0;

    const yearObj = attendance.years.find((y) => y.year === currentYear);
    if (!yearObj) return res.json({ monthlyHours, weeklyHours });

    // Cache shifts we lookup to avoid repeated DB calls
    const shiftCache = new Map();

    for (const monthObj of yearObj.months) {
      for (const dateObj of monthObj.dates) {
        // Determine actual minutes for this date (ensure non-negative and numeric)
        const actualMinutesRaw = Number(dateObj.totalLogAfterBreak || 0);
        const actualMinutes = Math.max(
          0,
          Number.isFinite(actualMinutesRaw) ? actualMinutesRaw : 0,
        );
        if (actualMinutes > 0) {
          // build the date moment in IST for week comparison
          const dateMoment = Moment.tz(
            `${currentYear}-${monthObj.month}-${dateObj.date}`,
            "YYYY-M-D",
            "Asia/Kolkata",
          );
          if (monthObj.month === currentMonth) {
            monthlyHours += actualMinutes; // note: stored in minutes, will convert later
          }
          if (dateMoment.isoWeek() === currentWeek) {
            weeklyHours += actualMinutes;
          }
        }

        // Skip expected hours for explicit non-working markers
        const isNonWorking =
          dateObj.status === "WO" ||
          dateObj.isOnLeave ||
          dateObj.isNCNS ||
          dateObj.isForcedAbsent;

        // Expected minutes calculation based on assigned shift
        try {
          if (!isNonWorking && dateObj.shifts) {
            // dateObj.shifts may be an ObjectId or a populated shift object
            let shift = null;
            if (
              typeof dateObj.shifts === "object" &&
              dateObj.shifts !== null &&
              dateObj.shifts.startTime
            ) {
              shift = dateObj.shifts; // already populated
            } else {
              const shiftId = String(dateObj.shifts);
              shift = shiftCache.get(shiftId);
              if (!shift) {
                shift = await Shift.findById(shiftId).lean();
                shiftCache.set(shiftId, shift);
              }
            }

            if (shift && shift.startTime && shift.endTime) {
              // Accept multiple time formats (24h and 12h with AM/PM)
              const timeFormats = [
                "YYYY-M-D HH:mm:ss",
                "YYYY-M-D HH:mm",
                "YYYY-M-D hh:mm A",
              ];
              let startMoment = Moment.tz(
                `${currentYear}-${monthObj.month}-${dateObj.date} ${shift.startTime}`,
                timeFormats,
                "Asia/Kolkata",
              );
              let endMoment = Moment.tz(
                `${currentYear}-${monthObj.month}-${dateObj.date} ${shift.endTime}`,
                timeFormats,
                "Asia/Kolkata",
              );

              // Fallback: parse time-only strings and apply to date in IST
              if (!startMoment.isValid()) {
                const parsedStart = Moment(shift.startTime, [
                  "HH:mm:ss",
                  "HH:mm",
                  "hh:mm A",
                  "h:mm A",
                ]);
                startMoment = Moment.tz(
                  `${currentYear}-${monthObj.month}-${dateObj.date}`,
                  "YYYY-M-D",
                  "Asia/Kolkata",
                )
                  .hour(parsedStart.hour())
                  .minute(parsedStart.minute())
                  .second(parsedStart.second());
              }
              if (!endMoment.isValid()) {
                const parsedEnd = Moment(shift.endTime, [
                  "HH:mm:ss",
                  "HH:mm",
                  "hh:mm A",
                  "h:mm A",
                ]);
                endMoment = Moment.tz(
                  `${currentYear}-${monthObj.month}-${dateObj.date}`,
                  "YYYY-M-D",
                  "Asia/Kolkata",
                )
                  .hour(parsedEnd.hour())
                  .minute(parsedEnd.minute())
                  .second(parsedEnd.second());
              }

              // If end is same or before start, assume overnight and add 1 day
              if (!endMoment.isAfter(startMoment)) {
                endMoment.add(1, "day");
              }

              const durationMin = Math.round(
                endMoment.diff(startMoment, "minutes"),
              );
              if (monthObj.month === currentMonth)
                expectedMonthlyMinutes += durationMin;
              const dateMoment = Moment.tz(
                `${currentYear}-${monthObj.month}-${dateObj.date}`,
                "YYYY-M-D",
                "Asia/Kolkata",
              );
              if (dateMoment.isoWeek() === currentWeek)
                expectedWeeklyMinutes += durationMin;
            }
          }
        } catch (err) {
          console.error(
            "Error computing expected minutes for date",
            monthObj.month,
            dateObj.date,
            err,
          );
        }
      }
    }

    // Calculate today's actual and expected minutes
    const todayDate = now.date();
    let actualTodayMinutes = 0;
    let expectedTodayMinutes = 0;
    try {
      const currentMonthObj = yearObj.months.find(
        (m) => m.month === currentMonth,
      );
      if (currentMonthObj) {
        const todayObj = currentMonthObj.dates.find(
          (d) => d.date === todayDate,
        );
        if (todayObj) {
          actualTodayMinutes = Number(todayObj.totalLogAfterBreak || 0);
          const isNonWorking =
            todayObj.status === "WO" ||
            todayObj.isOnLeave ||
            todayObj.isNCNS ||
            todayObj.isForcedAbsent;
          if (!isNonWorking && todayObj.shifts) {
            const shiftId = String(todayObj.shifts);
            let shift = shiftCache.get(shiftId);
            if (!shift) {
              shift = await Shift.findById(shiftId).lean();
              shiftCache.set(shiftId, shift);
            }
            if (shift && shift.startTime && shift.endTime) {
              let startMoment = Moment.tz(
                `${currentYear}-${currentMonth}-${todayObj.date} ${shift.startTime}`,
                ["YYYY-M-D HH:mm:ss", "YYYY-M-D HH:mm"],
                "Asia/Kolkata",
              );
              let endMoment = Moment.tz(
                `${currentYear}-${currentMonth}-${todayObj.date} ${shift.endTime}`,
                ["YYYY-M-D HH:mm:ss", "YYYY-M-D HH:mm"],
                "Asia/Kolkata",
              );
              if (!startMoment.isValid()) {
                const parsedStart = Moment(shift.startTime, [
                  "HH:mm:ss",
                  "HH:mm",
                ]);
                startMoment = Moment.tz(
                  `${currentYear}-${currentMonth}-${todayObj.date}`,
                  "YYYY-M-D",
                  "Asia/Kolkata",
                )
                  .hour(parsedStart.hour())
                  .minute(parsedStart.minute());
              }
              if (!endMoment.isValid()) {
                const parsedEnd = Moment(shift.endTime, ["HH:mm:ss", "HH:mm"]);
                endMoment = Moment.tz(
                  `${currentYear}-${currentMonth}-${todayObj.date}`,
                  "YYYY-M-D",
                  "Asia/Kolkata",
                )
                  .hour(parsedEnd.hour())
                  .minute(parsedEnd.minute());
              }
              if (!endMoment.isAfter(startMoment)) {
                endMoment.add(1, "day");
              }
              expectedTodayMinutes = Math.round(
                endMoment.diff(startMoment, "minutes"),
              );
            }
          }
        }
      }
    } catch (err) {
      console.error("Error computing today's expected minutes:", err);
    }

    // Convert minutes to hours (rounded to 2 decimals) and include expected vs actual
    const actualMonthlyHours = +(monthlyHours / 60).toFixed(2);
    const actualWeeklyHours = +(weeklyHours / 60).toFixed(2);
    const expectedMonthlyHours = +(expectedMonthlyMinutes / 60).toFixed(2);
    const expectedWeeklyHours = +(expectedWeeklyMinutes / 60).toFixed(2);
    // Standard expected hours based on 8 hours/day and work-days-per-week (5 or 6)
    // Accept optional query param `workDaysPerWeek` (5 or 6). Default is 5.
    const workDaysPerWeek = Number(req.query.workDaysPerWeek) === 6 ? 6 : 5;
    const standardExpectedWeeklyHours = 8 * workDaysPerWeek;
    // Calculate working days in current month according to workDaysPerWeek
    const daysInMonth = now.daysInMonth();
    let workingDaysInMonth = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = Moment.tz(
        `${currentYear}-${currentMonth}-${d}`,
        "YYYY-M-D",
        "Asia/Kolkata",
      ).day(); // 0=Sun ..6=Sat
      if (workDaysPerWeek === 5) {
        // Mon-Fri are working (1..5)
        if (dow >= 1 && dow <= 5) workingDaysInMonth++;
      } else {
        // 6 day week: Mon-Sat (1..6)
        if (dow >= 1 && dow <= 6) workingDaysInMonth++;
      }
    }
    // Subtract declared holidays (status 'HD') recorded in attendance for this month
    try {
      const monthObjForCurrent = yearObj.months.find(
        (m) => m.month === currentMonth,
      );
      if (monthObjForCurrent) {
        for (const dObj of monthObjForCurrent.dates) {
          if (dObj.status === "HD") {
            // ensure we only decrement if that day was counted as working
            const dow = Moment.tz(
              `${currentYear}-${currentMonth}-${dObj.date}`,
              "YYYY-M-D",
              "Asia/Kolkata",
            ).day();
            if (
              (workDaysPerWeek === 5 && dow >= 1 && dow <= 5) ||
              (workDaysPerWeek === 6 && dow >= 1 && dow <= 6)
            ) {
              workingDaysInMonth = Math.max(0, workingDaysInMonth - 1);
            }
          }
        }
      }
    } catch (err) {
      console.warn(
        "Failed to subtract holidays for standard monthly calc",
        err,
      );
    }
    const standardExpectedMonthlyHours = +(workingDaysInMonth * 8).toFixed(2);
    res.json({
      actualMonthlyHours,
      expectedMonthlyHours,
      standardExpectedMonthlyHours,
      standardExpectedWeeklyHours,
      monthlyDiffHours: +(actualMonthlyHours - expectedMonthlyHours).toFixed(2),
      actualWeeklyHours,
      expectedWeeklyHours,
      weeklyDiffHours: +(actualWeeklyHours - expectedWeeklyHours).toFixed(2),
      actualTodayHours: +(actualTodayMinutes / 60).toFixed(2),
      expectedTodayHours: +(expectedTodayMinutes / 60).toFixed(2),
      dailyDiffHours: +(
        (actualTodayMinutes - expectedTodayMinutes) /
        60
      ).toFixed(2),
    });
  } catch (error) {
    console.error("Error calculating working hours summary:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Detailed breakdown: per-day (month), per-week summary and today's details
const getWorkingHoursBreakdown = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId)
      return res.status(400).json({ error: "employeeId required" });

    const attendance = await AttendanceModel.findOne({
      employeeObjID: employeeId,
    });
    if (!attendance)
      return res.status(404).json({ error: "Attendance record not found." });

    const now = Moment().tz("Asia/Kolkata");
    const currentYear = now.year();
    const currentMonth = now.month() + 1; // 1-based
    const daysInMonth = now.daysInMonth();

    const yearObj = attendance.years.find((y) => y.year === currentYear);
    if (!yearObj)
      return res.status(200).json({
        month: currentMonth,
        days: [],
        weeklySummary: [],
        today: null,
      });

    const monthObj = yearObj.months.find((m) => m.month === currentMonth) || {
      month: currentMonth,
      dates: [],
    };

    // Cache shifts
    const shiftCache = new Map();

    // Helper to compute expected minutes for a dateObj (or using shiftId)
    const computeExpectedForDate = async (dObj) => {
      try {
        if (!dObj) return 0;
        const isNonWorking =
          dObj.status === "WO" ||
          dObj.isOnLeave ||
          dObj.isNCNS ||
          dObj.isForcedAbsent;
        if (isNonWorking) return 0;
        let shift = null;
        if (
          typeof dObj.shifts === "object" &&
          dObj.shifts !== null &&
          dObj.shifts.startTime
        ) {
          shift = dObj.shifts;
        } else if (dObj.shifts) {
          const sid = String(dObj.shifts);
          shift = shiftCache.get(sid);
          if (!shift) {
            shift = await Shift.findById(sid).lean();
            shiftCache.set(sid, shift);
          }
        }
        if (!shift || !shift.startTime || !shift.endTime) return 0;

        const timeFormats = [
          "YYYY-M-D HH:mm:ss",
          "YYYY-M-D HH:mm",
          "YYYY-M-D hh:mm A",
        ];
        let startMoment = Moment.tz(
          `${currentYear}-${currentMonth}-${dObj.date} ${shift.startTime}`,
          timeFormats,
          "Asia/Kolkata",
        );
        let endMoment = Moment.tz(
          `${currentYear}-${currentMonth}-${dObj.date} ${shift.endTime}`,
          timeFormats,
          "Asia/Kolkata",
        );
        if (!startMoment.isValid()) {
          const p = Moment(shift.startTime, ["HH:mm:ss", "HH:mm", "hh:mm A"]);
          startMoment = Moment.tz(
            `${currentYear}-${currentMonth}-${dObj.date}`,
            "YYYY-M-D",
            "Asia/Kolkata",
          )
            .hour(p.hour())
            .minute(p.minute())
            .second(p.second());
        }
        if (!endMoment.isValid()) {
          const p = Moment(shift.endTime, ["HH:mm:ss", "HH:mm", "hh:mm A"]);
          endMoment = Moment.tz(
            `${currentYear}-${currentMonth}-${dObj.date}`,
            "YYYY-M-D",
            "Asia/Kolkata",
          )
            .hour(p.hour())
            .minute(p.minute())
            .second(p.second());
        }
        if (!endMoment.isAfter(startMoment)) endMoment.add(1, "day");
        return Math.max(0, Math.round(endMoment.diff(startMoment, "minutes")));
      } catch (err) {
        console.error("computeExpectedForDate error", err);
        return 0;
      }
    };

    // Build per-day list for current month
    const days = [];
    // map of weekNumber -> { startDate, endDate, actualMinutes, expectedMinutes }
    const weeklyMap = new Map();

    // Pre-index dates for quick lookup
    const dateIndex = new Map();
    for (const d of monthObj.dates || []) dateIndex.set(Number(d.date), d);

    // iterate days 1..daysInMonth
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = dateIndex.get(d) || null;
      const dateMoment = Moment.tz(
        `${currentYear}-${currentMonth}-${d}`,
        "YYYY-M-D",
        "Asia/Kolkata",
      );
      const isoWeek = dateMoment.isoWeek();

      const actualMinutes = dateObj
        ? Math.max(0, Number(dateObj.totalLogAfterBreak || 0))
        : 0;
      const expectedMinutes = dateObj
        ? await computeExpectedForDate(dateObj)
        : 0;

      days.push({
        date: d,
        dayOfWeek: dateMoment.format("dddd"),
        actualMinutes,
        expectedMinutes,
        loginTimes: dateObj
          ? Array.isArray(dateObj.loginTime)
            ? dateObj.loginTime
            : []
          : [],
        logoutTimes: dateObj
          ? Array.isArray(dateObj.logoutTime)
            ? dateObj.logoutTime
            : []
          : [],
        totalBrake: dateObj ? Number(dateObj.totalBrake || 0) : 0,
        status: dateObj ? dateObj.status : "NA",
      });

      // accumulate weekly
      const wk = isoWeek;
      const w = weeklyMap.get(wk) || {
        weekNumber: wk,
        startDate: null,
        endDate: null,
        actualMinutes: 0,
        expectedMinutes: 0,
      };
      if (!w.startDate)
        w.startDate = dateMoment.startOf("isoWeek").format("YYYY-MM-DD");
      w.endDate = dateMoment.endOf("isoWeek").format("YYYY-MM-DD");
      w.actualMinutes += actualMinutes;
      w.expectedMinutes += expectedMinutes;
      weeklyMap.set(wk, w);
    }

    const weeklySummary = Array.from(weeklyMap.values()).sort(
      (a, b) => a.weekNumber - b.weekNumber,
    );

    // today's detail
    const todayDay = now.date();
    const todayEntry = days.find((x) => x.date === todayDay) || null;

    // totals
    const totalMonthlyActualMinutes = days.reduce(
      (s, x) => s + x.actualMinutes,
      0,
    );
    const totalMonthlyExpectedMinutes = days.reduce(
      (s, x) => s + x.expectedMinutes,
      0,
    );

    // convert some totals to hours with 2 decimals
    const totals = {
      totalMonthlyActualHours: +(totalMonthlyActualMinutes / 60).toFixed(2),
      totalMonthlyExpectedHours: +(totalMonthlyExpectedMinutes / 60).toFixed(2),
      weeklySummary: weeklySummary.map((w) => ({
        weekNumber: w.weekNumber,
        startDate: w.startDate,
        endDate: w.endDate,
        actualHours: +(w.actualMinutes / 60).toFixed(2),
        expectedHours: +(w.expectedMinutes / 60).toFixed(2),
      })),
    };

    return res.status(200).json({
      month: currentMonth,
      days,
      weeklySummary: totals.weeklySummary,
      totals,
      today: todayEntry,
    });
  } catch (err) {
    console.error("getWorkingHoursBreakdown error", err);
    return res.status(500).json({ error: "internal error" });
  }
};

const getAttendanceRegister = async (req, res) => {
  try {
    const { year, month } = req.params;
    const y = Number(year);
    const m = Number(month);

    const daysInMonth = new Date(y, m, 0).getDate();

    // STEP 1: Load active employees
    const employees = await Employee.find({
      isFullandFinal: { $ne: "Yes" },
      status: "active",
    }).select(
      "FirstName LastName empID salary department position DateOfJoining LocationType",
    );

    // STEP 2: Load entire month attendance
    const attendanceData = await Attendance.find({
      year: y,
      month: m,
    });

    const finalResponse = [];

    for (const emp of employees) {
      const dailyStatus = [];
      const summary = {
        present: 0,
        absent: 0,
        halfday: 0,
        holiday: 0, // Week-Off + Holidays both counted here
        paidLeaves: 0,
        unpaidLeaves: 0,
        ncns: 0,
        sandwich: 0,
        totalPayableDays: 0,
      };

      for (let day = 1; day <= daysInMonth; day++) {
        const record = attendanceData.find(
          (a) =>
            a.employeeObjID?.toString() === emp._id.toString() &&
            a.date === day,
        );

        let status = "--";

        /* -------------------------------------------
           RULE 1: WEEK-OFF (Saturday or Sunday)
        ------------------------------------------- */
        const jsDate = new Date(y, m - 1, day);
        const weekDay = jsDate.getDay(); // 0=Sun, 6=Sat

        if (weekDay === 0 || weekDay === 6) {
          status = "W";
          summary.holiday++; // Week-Off is payable
          dailyStatus.push({ day, status });
          continue;
        }

        /* -------------------------------------------
           RULE 2: No attendance record → Absent
        ------------------------------------------- */
        if (!record) {
          status = "A";
          summary.absent++;
          dailyStatus.push({ day, status });
          continue;
        }

        const {
          isOnLeave,
          leaveAttendanceData,
          isNCNS,
          isSandwhich,
          shifts,
          totalLogAfterBreak,
          isHoliday,
        } = record;

        /* -------------------------------------------
           RULE 3: Festival Holiday (Company Holiday)
        ------------------------------------------- */
        if (isHoliday) {
          status = "O"; // Holiday
          summary.holiday++; // payable
          dailyStatus.push({ day, status });
          continue;
        }

        /* -------------------------------------------
           RULE 4: NCNS
        ------------------------------------------- */
        if (isNCNS) {
          status = "N";
          summary.ncns++;
          dailyStatus.push({ day, status });
          continue;
        }

        /* -------------------------------------------
           RULE 5: Sandwich Leave
        ------------------------------------------- */
        if (isSandwhich) {
          status = "S";
          summary.sandwich++;
          dailyStatus.push({ day, status });
          continue;
        }

        /* -------------------------------------------
           RULE 6: On Leave (Paid/Unpaid + Full/Half day)
        ------------------------------------------- */
        if (isOnLeave) {
          const dur = leaveAttendanceData?.leaveDuration;
          const type = leaveAttendanceData?.leaveType;

          if (dur === "Full Day") {
            if (type === "Paid") {
              status = "VF";
              summary.paidLeaves++;
            } else {
              status = "UF";
              summary.unpaidLeaves++;
            }
          } else if (dur === "Half Day") {
            if (type === "Paid") {
              status = "VH";
              summary.paidLeaves += 0.5;
            } else {
              status = "UH";
              summary.unpaidLeaves += 0.5;
            }
          }

          dailyStatus.push({ day, status });
          continue;
        }

        /* -------------------------------------------
           RULE 7: PRESENT / HALF DAY / ABSENT based on hours
        ------------------------------------------- */
        const minFull = shifts?.minHours || 360; // 6 hours
        const minHalf = shifts?.halfDayHours || 240; // 4 hours

        if (totalLogAfterBreak >= minFull) {
          status = "P";
          summary.present++;
        } else if (totalLogAfterBreak >= minHalf) {
          status = "H";
          summary.halfday++;
        } else {
          status = "A";
          summary.absent++;
        }

        dailyStatus.push({ day, status });
      }

      /* -------------------------------------------
         RULE 8: Sandwich Auto Calculation
      ------------------------------------------- */
      for (let d = 2; d < daysInMonth; d++) {
        const prev = dailyStatus[d - 2].status;
        const today = dailyStatus[d - 1].status;
        const next = dailyStatus[d].status;

        if (prev === "A" && today === "A" && next === "A") {
          dailyStatus[d - 1].status = "S";
          summary.sandwich++;
          summary.absent--;
        }
      }

      /* -------------------------------------------
         RULE 9: Final Payable Days
      ------------------------------------------- */
      summary.totalPayableDays =
        summary.present +
        summary.halfday * 0.5 +
        summary.paidLeaves +
        summary.holiday;

      /* ------------------------------------------- */
      finalResponse.push({
        employeeObjID: emp,
        attendance: {
          year: y,
          month: m,
          dailyStatus,
          summary,
        },
      });
    }

    res.status(200).json(finalResponse);
  } catch (err) {
    console.log("REGISTER ERROR →", err);
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

const getAttendanceRaw = async (req, res) => {
  try {
    const users = await Employee.find({ isFullandFinal: { $ne: "Yes" } });
    const attendance = await AttendanceModel.find({
      employeeObjID: { $in: users.map((u) => u._id) },
    })
      .populate(
        "employeeObjID",
        "FirstName LastName empID Account reportManager position department profile",
      )
      .populate(
        "years.months.dates.LeaveApplication",
        "leaveType leaveDuration",
      )
      .populate("years.months.dates.holiday", "holidayName holidayType");

    res.status(200).json(attendance);
  } catch (error) {
    console.error("getAttendanceRaw error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/attendance/summary/:year/:month
const getAttendanceSummary = async (req, res) => {
  try {
    const { year, month } = req.params;
    const filterYear = parseInt(year, 10);
    const filterMonth = parseInt(month, 10);

    const employees = await Employee.find({
      isFullandFinal: { $ne: "Yes" },
    }).select(
      "FirstName LastName empID Account reportManager position department profile",
    );

    const attendanceRecords = await AttendanceModel.find({
      employeeObjID: { $in: employees.map((e) => e._id) },
      "years.year": filterYear,
      "years.months.month": filterMonth,
    })
      .populate(
        "years.months.dates.LeaveApplication",
        "leaveType leaveDuration",
      )
      .populate("years.months.dates.holiday", "holidayName holidayType");

    const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();

    const summary = employees
      .map((emp) => {
        const record = attendanceRecords.find(
          (r) => r.employeeObjID.toString() === emp._id.toString(),
        );
        if (!record) {
          return {
            userId: emp._id,
            FirstName: emp.FirstName,
            LastName: emp.LastName,
            empID: emp.empID,
            Account: emp.Account,
            reportManager: emp.reportManager,
            position: emp.position?.[0] || null,
            department: emp.department?.[0] || null,
            profile: emp.profile,
            summary: {
              year: filterYear,
              month: filterMonth,
              monthName: monthName(filterMonth),
              daysInMonth,
              present: 0,
              absent: daysInMonth, // if no record, count as absent (adjust if needed)
              halfday: 0,
              holiday: 0,
              paidLeaves: 0,
              unpaidLeaves: 0,
              ncns: 0,
              sandwhich: 0,
              totalPayableDays: 0,
            },
            days: [],
          };
        }

        const yearData = record.years.find((y) => y.year === filterYear);
        const monthData = yearData?.months.find((m) => m.month === filterMonth);
        const dates = monthData?.dates || [];

        // Build per-day statuses using backend markAttendance
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dObj = dates.find((d) => d.date === day);

          const loginTime = dObj ? dObj.loginTime : [];
          const loginTimeLength = Array.isArray(dObj?.loginTime)
            ? dObj.loginTime.length
            : 0;
          const logoutTimeLength = Array.isArray(dObj?.logoutTime)
            ? dObj.logoutTime.length
            : 0;

          const netLogiHours = dObj?.totalLogAfterBreak
            ? parseInt(dObj.totalLogAfterBreak, 10)
            : NaN;

          const shifts = dObj?.shifts || {};
          const isNCNS = dObj?.isNCNS || false;
          const isOnLeave = dObj?.isOnLeave || false;
          const isSandwhich = dObj?.isSandwhich || dObj?.isSandwhich || false;
          const isForcedAbsent = dObj?.isForcedAbsent || false;
          const LeaveDurationName =
            dObj?.leaveAttendanceData?.leaveDuration || "";
          const LeaveTypeName = dObj?.leaveAttendanceData?.leaveType || "";

          const resMark = markAttendance({
            loginTime,
            day,
            shifts,
            isNCNS,
            isOnLeave,
            isSandwhich,
            isForcedAbsent,
            LeaveDurationName,
            LeaveTypeName,
            netLogiHours,
            loginTimeLength,
            logoutTimeLength,
            filterYear,
            filterMonth,
          });

          days.push({
            day,
            status: resMark.status,
            title: resMark.title,
            loginTime: loginTime,
            logoutTime: dObj?.logoutTime || [],
            totalLogAfterBreak: dObj?.totalLogAfterBreak || 0,
            holiday: dObj?.holiday ? dObj.holiday.holidayName : null,
            leave: dObj?.LeaveApplication
              ? {
                type: dObj.LeaveApplication.leaveType,
                duration: dObj.LeaveApplication.leaveDuration,
              }
              : dObj?.leaveAttendanceData?.leaveType
                ? {
                  type: dObj.leaveAttendanceData.leaveType,
                  duration: dObj.leaveAttendanceData.leaveDuration,
                }
                : null,
          });
        }

        const totals = calculateTotals(days);

        return {
          userId: emp._id,
          FirstName: emp.FirstName,
          LastName: emp.LastName,
          empID: emp.empID,
          Account: emp.Account,
          reportManager: emp.reportManager,
          position: emp.position?.[0] || null,
          department: emp.department?.[0] || null,
          profile: emp.profile,
          summary: {
            year: filterYear,
            month: filterMonth,
            monthName: monthName(filterMonth),
            daysInMonth,
            ...totals,
          },
          days,
        };
      })
      .filter(Boolean);

    res.status(200).json(summary);
  } catch (error) {
    console.error("getAttendanceSummary error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/attendance/process-payroll/:year/:month
// Creates/updates payroll records for all active employees based on backend totals
const processPayrollForMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const filterYear = parseInt(year, 10);
    const filterMonth = parseInt(month, 10);

    // Reuse summary logic to get totals
    req.params.year = filterYear.toString();
    req.params.month = filterMonth.toString();

    // Get summary by invoking controller logic directly
    const employees = await Employee.find({
      isFullandFinal: { $ne: "Yes" },
    }).select(
      "FirstName LastName empID Account reportManager position department profile salary DateOfJoining LocationType PANcardNo UANNumber BankName BankAccount BankIFSC isFullandFinal",
    );

    const attendanceRecords = await AttendanceModel.find({
      employeeObjID: { $in: employees.map((e) => e._id) },
      "years.year": filterYear,
      "years.months.month": filterMonth,
    })
      .populate(
        "years.months.dates.LeaveApplication",
        "leaveType leaveDuration",
      )
      .populate("years.months.dates.holiday", "holidayName holidayType");

    const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();

    const payrollDocs = [];

    for (const emp of employees) {
      const record = attendanceRecords.find(
        (r) => r.employeeObjID.toString() === emp._id.toString(),
      );
      const yearData = record?.years.find((y) => y.year === filterYear);
      const monthData = yearData?.months.find((m) => m.month === filterMonth);
      const dates = monthData?.dates || [];

      const days = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dObj = dates.find((d) => d.date === day);
        const loginTime = dObj ? dObj.loginTime : [];
        const loginTimeLength = Array.isArray(dObj?.loginTime)
          ? dObj.loginTime.length
          : 0;
        const logoutTimeLength = Array.isArray(dObj?.logoutTime)
          ? dObj.logoutTime.length
          : 0;
        const netLogiHours = dObj?.totalLogAfterBreak
          ? parseInt(dObj.totalLogAfterBreak, 10)
          : NaN;
        const shifts = dObj?.shifts || {};
        const isNCNS = dObj?.isNCNS || false;
        const isOnLeave = dObj?.isOnLeave || false;
        const isSandwhich = dObj?.isSandwhich || dObj?.isSandwhich || false;
        const isForcedAbsent = dObj?.isForcedAbsent || false;
        const LeaveDurationName =
          dObj?.leaveAttendanceData?.leaveDuration || "";
        const LeaveTypeName = dObj?.leaveAttendanceData?.leaveType || "";

        const resMark = markAttendance({
          loginTime,
          day,
          shifts,
          isNCNS,
          isOnLeave,
          isSandwhich,
          isForcedAbsent,
          LeaveDurationName,
          LeaveTypeName,
          netLogiHours,
          loginTimeLength,
          logoutTimeLength,
          filterYear,
          filterMonth,
        });

        days.push({ day, status: resMark.status });
      }

      const totals = calculateTotals(days);

      // Build payroll record similar to your frontend "records"
      const employeeData = {
        employeeObjID: emp._id,
        isAttChecked: true,
        status: "Proceed",
        SalaryStatus: "created",
        daysInMonth,
        absent: totals.absent,
        present: totals.present,
        halfday: totals.halfday,
        holiday: totals.holiday,
        paidLeaves: totals.paidLeaves,
        unpaidLeaves: totals.unpaidLeaves,
        NCNS: totals.ncns,
        Sandwhich: totals.sandwhich,
        totalPayableDays: totals.totalPayableDays,
        FullName: `${emp.FirstName || ""} ${emp.LastName || ""}`.trim(),
        empID: emp.empID || "Not Available",
        isFullandFinal: emp.isFullandFinal || "No",
        doj: emp.DateOfJoining || "Not Available",
        workLocation: emp.LocationType || "Not Available",
        PanNumber: emp.PANcardNo || "Not Available",
        UanNumber: emp.UANNumber || "Not Available",
        BankName: emp.BankName || "Not Available",
        BankAccount: emp.BankAccount || "Not Available",
        BankIFSC: emp.BankIFSC || "Not Available",
        departmentName: emp.department?.[0]?.DepartmentName || "Not Available",
        designationName: emp.position?.[0]?.PositionName || "Not Available",
        fixedBasic: emp.salary?.[0]?.BasicSalary || 0,
        fixedHRA: emp.salary?.[0]?.HRASalary || 0,
        fixedConvenyance: emp.salary?.[0]?.ConvenyanceAllowance || 0,
        fixedOthers: emp.salary?.[0]?.otherAllowance || 0,
        fixedTotalSalary: emp.salary?.[0]?.totalSalary || 0,
      };

      payrollDocs.push({
        year: filterYear,
        month: filterMonth,
        employeeObjID: emp._id,
        employeeData,
      });
    }

    // Upsert many payroll records
    const bulkOps = payrollDocs.map((doc) => ({
      updateOne: {
        filter: {
          employeeObjID: doc.employeeObjID,
          year: doc.year,
          month: doc.month,
        },
        update: { $set: doc },
        upsert: true,
      },
    }));

    if (bulkOps.length) {
      await Payroll.bulkWrite(bulkOps);
    }

    res.status(200).json({
      message: "Payroll processed successfully",
      count: payrollDocs.length,
      month: filterMonth,
      year: filterYear,
    });
  } catch (error) {
    console.error("processPayrollForMonth error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAttendanceFilters = async (req, res) => {
  try {
    // Check if there are any attendance records
    const recordCount = await AttendanceModel.countDocuments();

    let years = [];
    let months = [];

    if (recordCount > 0) {
      // Get distinct years
      years = await AttendanceModel.distinct("years.year")
        .sort()
        .catch((err) => []);

      // Get distinct months using aggregation
      try {
        const monthsResult = await AttendanceModel.aggregate([
          { $match: { "years.months": { $exists: true, $ne: [] } } },
          { $unwind: "$years" },
          { $unwind: "$years.months" },
          { $group: { _id: "$years.months.month" } },
          { $sort: { _id: 1 } },
        ]);
        months = monthsResult.map((r) => r._id);
      } catch (aggError) {
        console.log("Aggregation failed:", aggError.message);
      }
    }

    // If no data found, provide defaults
    if (years.length === 0) {
      years = [new Date().getFullYear()];
    }
    if (months.length === 0) {
      months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }

    res.status(200).json({ years, months });
  } catch (error) {
    console.error("Error fetching attendance filters:", error);
    // Return defaults on any error
    res.status(200).json({
      years: [new Date().getFullYear()],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    });
  }
};

module.exports = {
  createAttendance,
  createHolidays,
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  findAllHolidays,
  getHolidaysByMonth,
  deleteHoliday,
  attendanceRegister,
  todaysAttendance,
  getEmployeeTodayAttendance,
  updateAttendance,
  updateAttendanceStatus,
  updateBreak,
  getBreakInfo,
  getBreakInfoByEmail,
  checkEarlyForEmployee,
  canClockInForEmployee,
  markBreak,
  getWorkingHoursSummary,
  getWorkingHoursBreakdown,
  getAttendanceRegister,
  getAttendanceFilters,
  getAttendanceRaw,
  getAttendanceSummary,
  MonthlyLogSummary,
  processPayrollForMonth,
  getTodaysAttendanceMinimal,
  getTodaysAttendanceStatus,
  todaysTeamAttendance,
  dashboardAttendance,
  mytodaylogs,
  DashboardLogButton,
};
