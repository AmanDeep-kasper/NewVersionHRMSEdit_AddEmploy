const schedule = require("node-schedule");
// const schedule = require("node-schedule-tz");

const { AttendanceModel } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");

const scheduler = () => {
  schedule.scheduleJob("0 0 * * *", async () => {
    try {
      // Get all users from the database
      const employees = await Employee.find().populate("shifts");

      // Get the current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();

      // Check if current day is a weekend
      const isWeekend = (() => {
        const day = currentDate.getDay();
        if (day === 0) return true;

        if (day === 6) {
          // Check if it’s a Saturday
          const date = currentDate.getDate();
          const weekOfMonth = Math.ceil(date / 7);
          return weekOfMonth === 2 || weekOfMonth === 4;
        }

        return false;
      })();

      // Iterate over each user
      for (const user of employees) {
        // Find the attendance record for the specified year
        let attendanceRecord = await AttendanceModel.findOne({
          employeeObjID: user._id,
        });

        const defaultShift = user.shifts.length ? user.shifts[0] : null;
        if (!defaultShift) {
          console.error("No shift assigned to the employee:", user._id);
          continue;
        }

        console.log(defaultShift);

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
                    shifts: defaultShift ? [defaultShift._id] : [], // Ensure shifts is assigned properly
                  },
                ],
              },
            ],
          };
          attendanceRecord.years.push(yearObject);
        }

        // Find the current month object in the year object
        let monthObject = yearObject.months.find(
          (m) => m.month === currentMonth
        );

        // If the current month object doesn't exist, create a new one
        if (!monthObject) {
          monthObject = {
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
                shifts: defaultShift ? [defaultShift._id] : [], // Ensure shifts is assigned properly
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
            shifts: defaultShift ? [defaultShift._id] : [], // Ensure shifts is assigned properly
          };
          monthObject.dates.push(dateObject);
        }

        // Auto-set logout to shift end time if employee logged in but didn't log out
        // if (!isWeekend && dateObject.loginTime && dateObject.loginTime.length > 0 &&
        //   (!dateObject.logoutTime || dateObject.logoutTime.length === 0)) {
        //   // Employee has login but no logout; set logout to shift end time
        //   if (defaultShift && defaultShift.endTime) {
        //     dateObject.logoutTime = [defaultShift.endTime];
        //     // Also set logoutTimeMs (in minutes since epoch)
        //     const Moment = require("moment-timezone");
        //     const logoutMoment = Moment.tz(`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')} ${defaultShift.endTime}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
        //     if (logoutMoment.isValid()) {
        //       dateObject.logoutTimeMs = [Math.round(logoutMoment.valueOf() / 60000)];
        //     }
        //     console.log(`[Scheduler] Auto-logout set for employee ${user._id} on ${currentYear}-${currentMonth}-${currentDay} to ${defaultShift.endTime}`);
        //   }
        // }

        // Auto-set logout to shift end time if employee logged in but didn't log out
        if (!isWeekend && dateObject.loginTime && dateObject.loginTime.length > 0 &&
          (!dateObject.logoutTime || dateObject.logoutTime.length === 0)) {
          // Employee has login but no logout; set logout to shift end time
          if (defaultShift && defaultShift.endTime) {
            dateObject.logoutTime = [defaultShift.endTime];
            // Also set logoutTimeMs (in minutes since epoch)
            const Moment = require("moment-timezone");
            const logoutMoment = Moment.tz(`${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')} ${defaultShift.endTime}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
            if (logoutMoment.isValid()) {
              dateObject.logoutTimeMs = [Math.round(logoutMoment.valueOf() / 60000)];
            }
            // Mark the nested field as modified so Mongoose saves it
            attendanceRecord.markModified('years');
            console.log(`[Scheduler] Auto-logout set for employee ${user._id} on ${currentYear}-${currentMonth}-${currentDay} to ${defaultShift.endTime}`);
          }
        }

        // Save the attendance record
        await attendanceRecord.save();

        // Save the attendance record
        // await attendanceRecord.save();
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
    }
  });
};

module.exports = { scheduler };
