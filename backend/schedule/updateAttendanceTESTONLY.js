const { AttendanceModel } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");

const updateAttendanceTESTONLY = async () => {
  try {
    // Get all users from the database
    const employees = await Employee.find().populate("shifts");

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // Check if current day is a weekend
    const isWeekend = [0].includes(currentDate.getDay());

    // Iterate over each employee
    for (const user of employees) {
      // Find the attendance record for the specified year
      let attendanceRecord = await AttendanceModel.findOne({
        employeeObjID: user._id,
      });

      const defaultShift = user.shifts.length ? user.shifts[0] : null;
      if (!defaultShift) {
        console.error("No shift assigned to the employee.");
        continue;
      }

      // If no attendance record exists for the current year, create a new one
      if (!attendanceRecord) {
        attendanceRecord = new AttendanceModel({
          employeeObjID: user._id,
          years: [],
        });
      }

      // Find the current year object in the attendance record
      let yearObject = attendanceRecord.years.find(
        (y) => y.year === currentYear
      );

      // If the current year object doesn't exist, create a new one
      if (!yearObject) {
        yearObject = {
          year: currentYear,
          months: [
            {
              month: currentMonth,
              dates: [
                {
                  date: currentDay,
                  day: new Date(
                    currentYear,
                    currentMonth - 1,
                    currentDay
                  ).getDay(),
                  loginTime: isWeekend ? ["WO"] : [],
                  logoutTime: isWeekend ? ["WO"] : [],
                  breakTime: isWeekend ? ["WO"] : [],
                  resumeTime: isWeekend ? [0] : [],
                  breakTimeMs: isWeekend ? [0] : [],
                  resumeTimeMS: isWeekend ? [0] : [],
                  BreakReasion: isWeekend ? ["WO"] : [],
                  BreakData: isWeekend ? [0] : [],
                  status: isWeekend ? "WO" : "logout",
                  totalBrake: isWeekend ? 0 : 0,
                },
              ],
            },
          ],
        };
        attendanceRecord.years.push(yearObject);
      }

      // Find the current month object in the year object
      let monthObject = yearObject.months.find((m) => m.month === currentMonth);

      // If the current month object doesn't exist, create a new one
      if (!monthObject) {
        monthObject = {
          month: currentMonth,
          dates: [
            {
              date: currentDay,
              day: new Date(currentYear, currentMonth - 1, currentDay).getDay(),
              loginTime: isWeekend ? ["WO"] : [],
              logoutTime: isWeekend ? ["WO"] : [],
              breakTime: isWeekend ? ["WO"] : [],
              resumeTime: isWeekend ? [0] : [],
              breakTimeMs: isWeekend ? [0] : [],
              resumeTimeMS: isWeekend ? [0] : [],
              BreakReasion: isWeekend ? ["WO"] : [],
              BreakData: isWeekend ? [0] : [],
              status: isWeekend ? "WO" : "logout",
              totalBrake: isWeekend ? 0 : 0,
            },
          ],
        };
        yearObject.months.push(monthObject);
      }

      // Find the current date object in the month object
      let dateObject = monthObject.dates.find((d) => d.date === currentDay);

      // If the current date object doesn't exist, create a new one
      if (!dateObject) {
        dateObject = {
          date: currentDay,
          day: new Date(currentYear, currentMonth - 1, currentDay).getDay(),
          loginTime: isWeekend ? ["WO"] : [],
          logoutTime: isWeekend ? ["WO"] : [],
          breakTime: isWeekend ? ["WO"] : [],
          resumeTime: isWeekend ? [0] : [],
          breakTimeMs: isWeekend ? [0] : [],
          resumeTimeMS: isWeekend ? [0] : [],
          BreakReasion: isWeekend ? ["WO"] : [],
          BreakData: isWeekend ? [0] : [],
          status: isWeekend ? "WO" : "logout",
          totalBrake: isWeekend ? 0 : 0,
        };
        monthObject.dates.push(dateObject);
      }

      // Save the attendance record
      await attendanceRecord.save();
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
  }
};


module.exports = { updateAttendanceTESTONLY };
