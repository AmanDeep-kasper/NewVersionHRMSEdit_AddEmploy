const schedule = require("node-schedule");
const moment = require("moment-timezone");
const { AttendanceModel } = require("../models/attendanceModel");

/**
 * Runs every minute and ensures that if the current time has passed the
 * assigned shift start time for a given attendance date, we add a login
 * entry (if not already present) and update status to 'login'.
 * This complements existing logout scheduler which handles end-of-day logout.
 */
const loginScheduler = () => {
    // run every minute
    schedule.scheduleJob("*/1 * * * *", async () => {
        try {
            const now = moment().tz("Asia/Kolkata");
            const currentYear = now.year();
            const currentMonth = now.month() + 1;
            const currentDay = now.date();
            const currentMinutes = Math.round(now.valueOf() / 60000); // minutes since epoch

            // Load attendance records and populate nested shifts so we can read startTime
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
                if (!dateObject) continue;

                // Skip weekends/WO entries
                if (dateObject.status === "WO") continue;

                // Ensure we have an assigned shift object
                const shiftObj = dateObject.shifts && dateObject.shifts.startTime ? dateObject.shifts : null;
                if (!shiftObj || !shiftObj.startTime) continue;

                // Parse shift start time (assumed format HH:mm)
                const shiftStartMoment = moment(shiftObj.startTime, "HH:mm").tz("Asia/Kolkata");
                const shiftStartMinutes = Math.round(shiftStartMoment.valueOf() / 60000);

                // Allow auto-login 20 minutes before shift start.
                const earliestAutoLogin = shiftStartMinutes - 20;

                // If current time is at/after earliestAutoLogin and user hasn't logged in, add login
                const hasLogin = Array.isArray(dateObject.loginTimeMs) && dateObject.loginTimeMs.length > 0;

                if (currentMinutes >= earliestAutoLogin && !hasLogin) {
                    const nowFormatted = now.format("HH:mm:ss");

                    // push login time and ms (record actual time when scheduler ran)
                    dateObject.loginTime = dateObject.loginTime || [];
                    dateObject.loginTimeMs = dateObject.loginTimeMs || [];
                    dateObject.loginTime.push(nowFormatted);
                    dateObject.loginTimeMs.push(currentMinutes);

                    // Update status to login
                    dateObject.status = "login";

                    // Save the attendance record
                    await attendanceRecord.save();
                }
            }
        } catch (err) {
            console.error("loginScheduler error:", err);
        }
    });
};

module.exports = { loginScheduler };
