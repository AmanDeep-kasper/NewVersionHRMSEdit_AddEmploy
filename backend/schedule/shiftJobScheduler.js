const schedule = require("node-schedule");
const moment = require("moment-timezone");
const { AttendanceModel } = require("../models/attendanceModel");
const Shift = require("../models/ShiftModel");

/**
 * Single fixed-time job that checks all shifts and auto-logouts employees
 * whose shift has ended + 30 minutes, similar to logoutScheduler pattern.
 * Runs once daily at 23:54 IST.
 * 
 * Logic:
 * - For each shift, compute shiftEnd + 30 minutes threshold
 * - If current time >= threshold, auto-logout attendees who:
 *   - Are assigned to that shift for today
 *   - Have logged in but not logged out (loginCount > logoutCount)
 *   - Are not on WO (weekend/off)
 */
const shiftAutoLogoutScheduler = () => {
    try {
        // Run at 23:54 every day (IST), same pattern as logoutScheduler
        schedule.scheduleJob("54 23 * * *", async () => {
            try {
                const currentDate = moment().tz("Asia/Kolkata").toDate();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;
                const currentDay = currentDate.getDate();
                const currentMinutes = Math.round(currentDate.getTime() / 1000 / 60);

                // Fetch all shifts
                const shifts = await Shift.find();

                for (const shift of shifts) {
                    // Parse shift endTime (expect HH:mm or HH:mm:ss)
                    const endParts = (shift.endTime || "").split(":");
                    if (!endParts.length || !endParts[0]) continue;

                    const endHour = Number(endParts[0]);
                    const endMin = Number(endParts[1] || 0);

                    // Compute shift end + 30 minutes threshold in minutes since epoch (today)
                    const ref = moment().tz("Asia/Kolkata").startOf("day");
                    const shiftEndMoment = ref.clone().hour(endHour).minute(endMin);
                    const shiftEndMinutes = Math.round(shiftEndMoment.valueOf() / 60000);
                    const threshold = shiftEndMinutes + 30; // 30 minutes after shift end

                    // Only process if current time >= threshold
                    if (currentMinutes < threshold) continue;

                    console.log(`🔄 Checking auto-logout for shift ${shift.name || shift._id} (endTime + 30min: ${shiftEndMoment.clone().add(30, "minutes").format("HH:mm")})`);

                    // Find attendance records for today where assigned shift matches and login > logout
                    const attendanceRecords = await AttendanceModel.find().populate("years.months.dates.shifts");

                    for (const attendanceRecord of attendanceRecords) {
                        const yearObject = attendanceRecord.years.find((y) => y.year === currentYear);
                        if (!yearObject) continue;

                        const monthObject = yearObject.months.find((m) => m.month === currentMonth);
                        if (!monthObject) continue;

                        const dateObject = monthObject.dates.find((d) => d.date === currentDay);
                        if (!dateObject) continue;

                        if (dateObject.status === "WO") continue;

                        // Check if this attendance's shift matches the current shift being processed
                        const assignedShift =
                            dateObject.shifts && dateObject.shifts._id
                                ? dateObject.shifts._id.toString()
                                : dateObject.shifts
                                    ? dateObject.shifts.toString()
                                    : null;

                        if (assignedShift !== shift._id.toString()) continue;

                        // Check login > logout
                        const loginCount = Array.isArray(dateObject.loginTimeMs)
                            ? dateObject.loginTimeMs.length
                            : Array.isArray(dateObject.loginTime)
                                ? dateObject.loginTime.length
                                : 0;
                        const logoutCount = Array.isArray(dateObject.logoutTimeMs)
                            ? dateObject.logoutTimeMs.length
                            : Array.isArray(dateObject.logoutTime)
                                ? dateObject.logoutTime.length
                                : 0;

                        if (loginCount === 0 || loginCount <= logoutCount) continue; // nothing to do

                        const formattedLogout = moment().tz("Asia/Kolkata").format("HH:mm:ss");

                        // If user was on break, resume at logout time and compute break duration
                        if (dateObject.status === "break") {
                            dateObject.ResumeTime = dateObject.ResumeTime || [];
                            dateObject.resumeTimeMS = dateObject.resumeTimeMS || [];
                            dateObject.ResumeTime.push(formattedLogout);
                            dateObject.resumeTimeMS.push(currentMinutes);

                            const lastBreakMs = Array.isArray(dateObject.breakTimeMs)
                                ? dateObject.breakTimeMs.at(-1)
                                : null;
                            if (lastBreakMs) {
                                const breakData = currentMinutes - lastBreakMs;
                                dateObject.BreakData = dateObject.BreakData || [];
                                dateObject.BreakData.push(breakData);
                                dateObject.totalBrake = dateObject.BreakData.reduce((s, v) => s + (v || 0), 0);
                            }
                        }

                        // Add logout entry
                        dateObject.logoutTime = dateObject.logoutTime || [];
                        dateObject.logoutTimeMs = dateObject.logoutTimeMs || [];
                        dateObject.logoutTime.push(formattedLogout);
                        dateObject.logoutTimeMs.push(currentMinutes);

                        // Compute LogData and totals
                        const loginTimeArray = dateObject.loginTimeMs || [];
                        const logoutTimeArray = dateObject.logoutTimeMs || [];
                        const logData = logoutTimeArray.map((logout, index) => {
                            const login = loginTimeArray[index];
                            return login ? logout - login : 0;
                        });

                        dateObject.LogData = logData;
                        dateObject.TotalLogin = logData.reduce((sum, v) => sum + (v || 0), 0);
                        dateObject.totalLogAfterBreak =
                            dateObject.TotalLogin >= (dateObject.totalBrake || 0)
                                ? dateObject.TotalLogin - (dateObject.totalBrake || 0)
                                : 0;
                        dateObject.status = "logout";

                        await attendanceRecord.save();

                        console.log(`✅ Auto-logout for employee in shift ${shift.name || shift._id}`);
                    }
                }

                console.log("✅ Shift-based auto-logout check completed.");
            } catch (error) {
                console.error("❌ Error in shift auto-logout scheduler:", error);
            }
        });

        console.log("✅ Shift-based auto-logout scheduler initialized (runs daily at 23:54 IST).");
    } catch (err) {
        console.error("Error initializing shiftAutoLogoutScheduler:", err);
    }
};

module.exports = { shiftAutoLogoutScheduler };
