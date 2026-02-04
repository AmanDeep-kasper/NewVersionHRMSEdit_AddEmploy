// GET break/resume/total break info for a specific date (no update)

const { AttendanceModel, Holiday } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");
const schedule = require("node-schedule");
const Moment = require("moment-timezone");

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
    Moment().tz("Asia/Kolkata").valueOf() / 1000 / 60
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
    // Prevent manual login earlier than allowed window (30 minutes before shift start)
    if (status === "login") {
      try {
        // prefer the shift assigned to the date if present, otherwise use employee's default shift
        const assignedShift = (dateObject && dateObject.shifts && dateObject.shifts.startTime) ? dateObject.shifts : defaultShift;
        if (assignedShift && assignedShift.startTime) {
          const shiftStartMoment = Moment(assignedShift.startTime, "HH:mm").tz("Asia/Kolkata");
          const earliestAllowedMs = Math.round(shiftStartMoment.valueOf() / 1000 / 60) - 30; // minutes since epoch
          if (currentTimeMs < earliestAllowedMs) {
            return res.status(400).json({ error: "Your shift not started" });
          }
        }
      } catch (e) {
        console.error("Error validating login window:", e);
      }
    }
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
          -logoutTimeMs.length
        );
        const loginTimeMsArray = dateObject.loginTimeMs.slice(
          -logoutTimeMs.length
        );

        const loginDataArray = logoutTimeMSArray.map((login, index) => {
          const LogMs = loginTimeMsArray[index];
          return login - LogMs;
        });

        dateObject.LogData = [...dateObject.LogData, ...loginDataArray];

        dateObject.TotalLogin = dateObject.LogData.reduce(
          (sum, value) => sum + value,
          0
        );
        dateObject.totalLogAfterBreak = Math.max(
          0,
          dateObject.TotalLogin - dateObject.totalBrake
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
            -resumeTimeMS.length
          );
          const breakTimeMsArray = dateObject.breakTimeMs.slice(
            -resumeTimeMS.length
          );

          const breakDataArray = resumeTimeMSArray.map((Resume, index) => {
            const BreakMs = breakTimeMsArray[index];
            return Resume - BreakMs;
          });

          dateObject.BreakData = [...dateObject.BreakData, ...breakDataArray];

          dateObject.totalBrake = dateObject.BreakData.reduce(
            (sum, value) => sum + value,
            0
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

const createHolidays = async (req, res) => {
  try {
    // Create a new Holiday record using the Holiday model
    const newHoliday = new Holiday({
      holidayYear: req.body.holidayYear,
      holidayMonth: req.body.holidayMonth,
      holidayDate: req.body.holidayDate,
      holidayName: req.body.holidayName,
      holidayType: req.body.holidayType,
    });

    // Save the Holiday record
    await newHoliday.save();

    // Get the holiday details
    const { holidayYear, holidayMonth, holidayDate, holidayName, holidayType } =
      newHoliday;

    // Fetch all employees
    const employees = await Employee.find().populate("shifts");

    if (!employees.length) {
      return res.status(404).json({ error: "No employees found" });
    }

    // Loop through employees to update attendance
    for (const employee of employees) {
      const attendanceRecord = await AttendanceModel.findById(
        employee.attendanceObjID
      );

      if (!attendanceRecord) {
        continue; // Skip if attendance record is missing
      }

      // Find or create the year object
      let yearObject = attendanceRecord.years.find(
        (y) => y.year === holidayYear
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
                  day: new Date(
                    holidayYear,
                    holidayMonth - 1,
                    holidayDate
                  ).getDay(),
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
                  shifts: employee.shifts.length
                    ? employee.shifts[0]._id
                    : null,
                  holiday: newHoliday._id,
                },
              ],
            },
          ],
        };
        attendanceRecord.years.push(yearObject);
      }

      // Find or create the month object
      let monthObject = yearObject.months.find((m) => m.month === holidayMonth);
      if (!monthObject) {
        monthObject = {
          month: holidayMonth,
          dates: [
            {
              date: holidayDate,
              day: new Date(
                holidayYear,
                holidayMonth - 1,
                holidayDate
              ).getDay(),
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
              shifts: employee.shifts.length ? employee.shifts[0]._id : null,
              holiday: newHoliday._id,
            },
          ],
        };
        yearObject.months.push(monthObject);
      }

      // Find or create the date object
      let dateObject = monthObject.dates.find((d) => d.date === holidayDate);
      if (!dateObject) {
        dateObject = {
          date: holidayDate,
          day: new Date(holidayYear, holidayMonth - 1, holidayDate).getDay(),
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
          shifts: employee.shifts.length ? employee.shifts[0]._id : null,
          holiday: newHoliday._id,
        };
        monthObject.dates.push(dateObject);
      } else {
        dateObject.holiday = newHoliday._id;
        dateObject.status = "HD";
      }

      await attendanceRecord.save();
    }

    res.status(201).json({
      message: "Holiday created and attendance updated successfully",
      newHoliday,
    });
  } catch (error) {
    console.error("Error creating holiday and updating attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBreakInfo = async (req, res) => {
  try {
    const { attendanceId, date } = req.query;
    if (!attendanceId || !date) {
      return res.status(400).json({ message: "attendanceId and date are required" });
    }
    const attendanceObj = await AttendanceModel.findById(attendanceId);
    if (!attendanceObj) return res.status(404).json({ message: "Attendance record not found" });

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
      totalBrake: dateObj.totalBrake || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const findAttendance = async (req, res) => {
  try {
    // Step 1: Find employee IDs where isFullandFinal !== "Yes"
    const activeEmployees = await Employee.find({ isFullandFinal: { $ne: "Yes" } }).select("_id");

    const activeEmployeeIds = activeEmployees.map(emp => emp._id);

    // Step 2: Fetch attendance data only for those employees
    const attendanceData = await AttendanceModel.find({
      employeeObjID: { $in: activeEmployeeIds },
    })
      .populate({
        path: "employeeObjID",
        populate: {
          path: "salary position department",
        },
      })
      .populate("years.months.dates.shifts")
      .populate("years.months.dates.holiday")
      .populate("years.months.dates.LeaveApplication");

    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateBreak = async (req, res) => {
  try {
    const { attendanceId, date, breakTime, resumeTime, totalBrake } = req.body;
    if (!attendanceId || !date) {
      return res.status(400).json({ message: "attendanceId and date are required" });
    }
    const attendanceObj = await AttendanceModel.findById(attendanceId);
    if (!attendanceObj) return res.status(404).json({ message: "Attendance record not found" });

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

    // Update breakTime and resumeTime arrays
    if (typeof breakTime !== 'undefined' && breakTime !== "") {
      if (!dateObj.breakTime) dateObj.breakTime = [];
      dateObj.breakTime.push(breakTime);
    }
    if (typeof resumeTime !== 'undefined' && resumeTime !== "") {
      if (!dateObj.resumeTime) dateObj.resumeTime = [];
      dateObj.resumeTime.push(resumeTime);
    }
    // Update totalBrake if provided
    if (typeof totalBrake !== 'undefined' && totalBrake !== "") {
      dateObj.totalBrake = Number(totalBrake);
    }
    attendanceObj.markModified("years");
    await attendanceObj.save();
    res.status(200).json({ message: "Break/Resume/Total Break updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update totalBrake if provided
// (Move this logic inside the try block, before sending response)


const findEmployeeAttendanceId = async (req, res) => {
  try {
    // Step 1: Find active employee IDs (isFullandFinal !== "Yes")
    const activeEmployees = await Employee.find({ isFullandFinal: { $ne: "Yes" } }).select("_id");
    const activeEmployeeIds = activeEmployees.map(emp => emp._id);

    // Step 2: Fetch attendance for only those employees
    const allAttendance = await AttendanceModel.find({
      employeeObjID: { $in: activeEmployeeIds },
    }).populate(
      "employeeObjID years.months.dates.shifts years.months.dates.holiday years.months.dates.LeaveApplication"
    );

    res.status(200).json(allAttendance);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const moment = require("moment-timezone");

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
      return res
        .status(404)
        .json({ error: "Active employee not found or already marked Full and Final" });
    }

    // console.log(`Employee found: ${employee._id}, Name: ${employee.name}`);

    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
    }).populate(
      "years.months.dates.shifts years.months.dates.holiday years.months.dates.LeaveApplication"
    );

    if (!attendanceRecord) {
      console.log(`No attendance record found for employee ID: ${employeeId}`);
      return res
        .status(404)
        .json({ error: "Attendance record not found for the user" });
    }

    // Get current IST date
    const currentISTDate = moment.tz("Asia/Kolkata");
    const currentYear = currentISTDate.year();
    const currentMonth = currentISTDate.month(); // 0-based
    const currentDay = currentISTDate.date();

    const yearRecord = attendanceRecord.years.find(
      (year) => year.year === currentYear
    );

    if (!yearRecord) {
      return res
        .status(404)
        .json({ error: "No attendance record found for current year" });
    }

    const monthRecord = yearRecord.months.find(
      (month) => month.month === currentMonth + 1
    );

    if (!monthRecord) {
      return res
        .status(404)
        .json({ error: "No attendance record found for current month" });
    }

    const todayRecord = monthRecord.dates.find(
      (date) => date.date === currentDay
    );

    if (!todayRecord) {
      return res
        .status(404)
        .json({ error: "No attendance record found for today" });
    }

    res.status(200).json({
      today: todayRecord,
      attendanceID: attendanceRecord._id,
      month: currentMonth + 1,
      year: currentYear,
    });
  } catch (error) {
    console.error("Error fetching attendance data by employee ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

const attendanceRegister = async (req, res) => {
  try {
    const { year, month } = req.params;

    const yearNumber = parseInt(year);
    const monthNumber = parseInt(month);

    // Fetch only active employees (not full and final)
    const users = await Employee.find({ isFullandFinal: { $ne: "Yes" } });

    const attendanceRegister = [];

    for (const employee of users) {
      const attendanceRecord = await AttendanceModel.findOne({
        employeeObjID: employee._id,
        "years.year": yearNumber,
        "years.months.month": monthNumber,
      });

      if (attendanceRecord) {
        const yearData = attendanceRecord.years.find(y => y.year === yearNumber);
        const monthData = yearData?.months.find(m => m.month === monthNumber);

        if (monthData) {
          const attendanceStatusMap = {
            P: "Present",
            A: "Absent",
            H: "Holiday",
            L: "Leave",
          };

          const attendanceData = monthData.dates.map(dateData => {
            return {
              date: dateData.date,
              status: attendanceStatusMap[dateData.status] || dateData.status,
            };
          });

          attendanceRegister.push({
            EmpId: employee.empID,
            Name: employee.name,
            Attendance: attendanceData,
          });
        }
      }
    }

    res.status(200).json(attendanceRegister);
  } catch (error) {
    console.error("Error fetching attendance register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const todaysAttendance = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // Step 1: Fetch only active employees who are NOT marked as Full and Final
    const usersWithAttendance = await Employee.find({
      status: "active",
      isFullandFinal: { $ne: "Yes" },
    })
      .populate("position department")
      .populate({
        path: "attendanceObjID",
        populate: {
          path: "years.months.dates.shifts years.months.dates.LeaveApplication",
        },
      });

    // Step 2: Process each user's attendance for today
    const attendanceData = usersWithAttendance.map((user) => {
      const attendanceRecord = user.attendanceObjID;
      let attendance = null;

      if (attendanceRecord?.years?.length > 0) {
        const yearData = attendanceRecord.years.find(
          (year) => year.year === currentYear
        );

        const monthData = yearData?.months?.find(
          (month) => month.month === currentMonth
        );

        const dateData = monthData?.dates?.find(
          (date) => date.date === currentDay
        );

        if (dateData) {
          attendance = dateData;
        }
      }

      return {
        userId: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        empID: user.empID,
        Account: user.Account,
        reportManager: user.reportManager,
        position: user.position?.[0] || null,
        department: user.department?.[0] || null,
        attendance: attendance,
        profile: user.profile,
      };
    });

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getEmployeeTodayAttendance = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Step 1: Fetch employee if not marked as Full and Final
    const employee = await Employee.findOne({
      _id: employeeId,
      isFullandFinal: { $ne: "Yes" },
    });

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

    // Step 3: Fetch attendance record
    let attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
    }).populate(
      "years.months.dates.shifts years.months.dates.LeaveApplication"
    );

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ error: "Attendance record not found for the employee" });
    }

    // Step 4: Get year data
    let yearData = attendanceRecord.years.find((y) => y.year === currentYear);

    if (!yearData) {
      // If no year, initialize structure
      yearData = {
        year: currentYear,
        months: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          dates: [],
        })),
      };
      attendanceRecord.years.push(yearData);
      await attendanceRecord.save();
    }

    // Step 5: Get month data
    const monthData = yearData.months.find(
      (month) => month.month === currentMonth
    );

    if (!monthData) {
      return res
        .status(404)
        .json({ error: "Attendance data not found for the current month" });
    }

    // Step 6: Get today's attendance
    const dateData = monthData.dates.find((date) => date.date === currentDay);

    if (!dateData) {
      return res
        .status(404)
        .json({ error: "Attendance data not found for today" });
    }

    // Step 7: Format response
    const employeeAttendanceData = {
      loginTime: dateData.loginTime?.[0] || null,
      logoutTime: dateData.logoutTime?.[dateData.logoutTime.length - 1] || null,
      totalBrake: dateData.totalBrake || 0,
      status: dateData.status || "Absent",
      totalLoginTime: dateData.totalLogAfterBreak || 0,
    };

    res.status(200).json(employeeAttendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance for employee:", error);
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
      attendance.attendanceObjID
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
      Moment().tz("Asia/Kolkata").valueOf() / 1000 / 60
    );
    const currentTime = Moment().tz("Asia/Kolkata").format("HH:mm:ss");

    // Update the login time, logout time, and remark
    if (loginTime) {
      dateObj.loginTime[0] = loginTime;
      dateObj.loginTimeMs[0] = Math.round(
        new Date(`${date}T${loginTime}`).getTime() / 1000 / 60
      );
    }

    if (logoutTime) {
      const lastIndex = dateObj.logoutTime.length - 1;
      if (lastIndex < 0) {
        dateObj.logoutTime.push(logoutTime);
        dateObj.logoutTimeMs.push(
          Math.round(new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60)
        );
      } else {
        dateObj.logoutTime[lastIndex] = logoutTime;
        dateObj.logoutTimeMs[lastIndex] = Math.round(
          new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60
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
      Boolean
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

module.exports = {
  createAttendance,
  createHolidays,
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  findAllHolidays,
  attendanceRegister,
  todaysAttendance,
  getEmployeeTodayAttendance,
  updateAttendance,
  updateAttendanceStatus,
  updateBreak,
  getBreakInfo,
};
