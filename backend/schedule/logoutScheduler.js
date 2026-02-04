const schedule = require("node-schedule");
const moment = require("moment-timezone");
const { AttendanceModel } = require("../models/attendanceModel");

const logoutScheduler = () => {
  schedule.scheduleJob("54 23 * * *", async () => {
    try {
      // Get the current date in IST
      const currentDate = moment().tz("Asia/Kolkata").toDate();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();
      const currentTime = Math.round(currentDate.getTime() / 1000 / 60);

      // Find all attendance records
      const attendanceRecords = await AttendanceModel.find().populate(
        "years.months.dates.shifts"
      );

      for (const attendanceRecord of attendanceRecords) {
        const yearObject = attendanceRecord.years.find(
          (y) => y.year === currentYear
        );
        if (!yearObject) continue;

        const monthObject = yearObject.months.find(
          (m) => m.month === currentMonth
        );
        if (!monthObject) continue;

        const dateObject = monthObject.dates.find((d) => d.date === currentDay);
        if (!dateObject || dateObject.status === "WO") continue;

        const shiftEndTime = moment(dateObject.shifts.endTime, "HH:mm")
          .tz("Asia/Kolkata")
          .format("HH:mm:ss");
        const shiftEndTimeMs = moment(dateObject.shifts.endTime, "HH:mm")
          .tz("Asia/Kolkata")
          .valueOf();

        const shiftEndTimeMinutes = shiftEndTimeMs / 60000;

        // Only process users whose last status is not "logout" or "WO"
        if (dateObject.status !== "logout" && dateObject.status !== "WO") {
          // Handle break time if the status was "break"
          if (dateObject.status === "break") {
            dateObject.ResumeTime.push(shiftEndTime);
            dateObject.resumeTimeMS.push(shiftEndTimeMinutes);
            const breakData = currentTime - dateObject.breakTimeMs.at(-1);
            dateObject.BreakData.push(breakData);
            dateObject.totalBrake = dateObject.BreakData.reduce(
              (sum, value) => sum + value,
              0
            );
          }

          // Add logout time if the status isn't already "logout" or "WO"
          dateObject.logoutTime.push(shiftEndTime);
          dateObject.logoutTimeMs.push(shiftEndTimeMinutes);

          const loginTimeArray = dateObject.loginTimeMs;
          const logoutTimeArray = dateObject.logoutTimeMs;

          // Calculate LogData
          const logData = logoutTimeArray.map((logout, index) => {
            const login = loginTimeArray[index];
            return login ? logout - login : 0;
          });

          dateObject.LogData = logData;
          dateObject.TotalLogin = logData.reduce(
            (sum, value) => sum + value,
            0
          );

          // Calculate totalLogAfterBreak
          dateObject.totalLogAfterBreak =
            dateObject.TotalLogin >= dateObject.totalBrake
              ? dateObject.TotalLogin - dateObject.totalBrake
              : 0;

          // Update the status to "logout"
          dateObject.status = "logout";
        }

        // Save the updated attendance record
        await attendanceRecord.save();
      }

      console.log("Logout process completed for all employees.");
    } catch (error) {
      console.error("Error during logout process:", error);
    }
  });
};


module.exports = { logoutScheduler };
