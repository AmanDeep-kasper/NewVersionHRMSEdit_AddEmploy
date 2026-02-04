const schedule = require("node-schedule");
const moment = require("moment-timezone");
const { AttendanceModel } = require("../models/attendanceModel");
const Shift = require("../models/ShiftModel");
const { Employee } = require("../models/employeeModel");
const sendNotification = require("../sendMail/notify");

/**
 * Scheduler that runs every 5 minutes to check for employees who:
 * 1. Have logged in before their shift start time (within the allowed 30-min window)
 * 2. Creates notifications for such early login attempts
 * 
 * Logic:
 * - Checks today's attendance records
 * - For each employee who has a login entry
 * - Verifies if login time is before shift start time
 * - If so, records it as an early login attempt for review
 * - Sends notification to employee
 */
const earlyLoginChecker = () => {
    try {
        // Run every 5 minutes
        schedule.scheduleJob("*/5 * * * *", async () => {
            try {
                const now = moment().tz("Asia/Kolkata");
                const currentYear = now.year();
                const currentMonth = now.month() + 1;
                const currentDay = now.date();
                const currentTime = now.format("HH:mm");
                const currentMinutes = Math.round(now.valueOf() / 60000);

                console.log(`🔍 Early login checker running at ${now.format("HH:mm:ss")}`);

                // Fetch all attendance records
                const attendanceRecords = await AttendanceModel.find().populate(
                    "employeeObjID years.months.dates.shifts"
                );

                for (const attendanceRecord of attendanceRecords) {
                    const employee = attendanceRecord.employeeObjID;
                    if (!employee) continue;

                    const yearObject = attendanceRecord.years.find(
                        (y) => y.year === currentYear
                    );
                    if (!yearObject) continue;

                    const monthObject = yearObject.months.find(
                        (m) => m.month === currentMonth
                    );
                    if (!monthObject) continue;

                    const dateObject = monthObject.dates.find(
                        (d) => d.date === currentDay
                    );
                    if (!dateObject) continue;

                    // Skip if weekend/WO
                    if (dateObject.status === "WO") continue;

                    // Check if has login entry
                    const hasLogin =
                        Array.isArray(dateObject.loginTimeMs) &&
                        dateObject.loginTimeMs.length > 0;
                    if (!hasLogin) continue;

                    // Get assigned shift
                    let assignedShift = null;
                    if (dateObject.shifts && dateObject.shifts._id) {
                        // Already populated
                        assignedShift = dateObject.shifts;
                    } else if (dateObject.shifts && typeof dateObject.shifts === "string") {
                        // Need to fetch
                        assignedShift = await Shift.findById(dateObject.shifts);
                    }

                    if (!assignedShift || !assignedShift.startTime) continue;

                    // Parse shift start time
                    const shiftStartMoment = moment(
                        assignedShift.startTime,
                        "HH:mm"
                    ).tz("Asia/Kolkata");
                    const shiftStartMinutes = Math.round(
                        shiftStartMoment.valueOf() / 60000
                    );
                    const shiftStart = shiftStartMoment.format("HH:mm");

                    // Get first login time (earliest login)
                    const firstLoginTime = dateObject.loginTime[0];
                    const firstLoginMs = dateObject.loginTimeMs[0];

                    if (!firstLoginTime || firstLoginMs === undefined) continue;

                    // Check if login is before shift start
                    if (firstLoginMs < shiftStartMinutes) {
                        const minutesBefore = shiftStartMinutes - firstLoginMs;

                        console.log(
                            `⚠️ Early login detected: Employee ${employee.FirstName} ${employee.LastName} (${employee.Email}) logged in ${minutesBefore} minutes before shift start (${shiftStart})`
                        );

                        // Record early login notification (optional: can store in a new collection)
                        // For now, log it and mark in attendance metadata
                        if (!dateObject.earlyLoginAttempts) {
                            dateObject.earlyLoginAttempts = [];
                        }

                        const attemptRecord = {
                            loginTime: firstLoginTime,
                            loginTimeMs: firstLoginMs,
                            shiftStartTime: shiftStart,
                            minutesBefore: minutesBefore,
                            checkedAt: now.format("HH:mm:ss"),
                            employeeEmail: employee.Email,
                            employeeName: `${employee.FirstName} ${employee.LastName}`,
                        };

                        // Only add if not already recorded
                        if (
                            !dateObject.earlyLoginAttempts.some(
                                (a) => a.loginTimeMs === firstLoginMs
                            )
                        ) {
                            dateObject.earlyLoginAttempts.push(attemptRecord);
                            await attendanceRecord.save();

                            // Determine recipient email: prefer personal email if present
                            const recipientEmail = (employee.presonalEmail && employee.presonalEmail !== "N/A")
                                ? employee.presonalEmail
                                : employee.Email;

                            // Send email notification using mailer
                            try {
                                await sendNotification({
                                    to: recipientEmail,
                                    subject: `Early login detected - your shift at ${shiftStart}`,
                                    templateVars: {
                                        employeeName: `${employee.FirstName} ${employee.LastName}`,
                                        shiftStartTime: shiftStart,
                                        loginTime: firstLoginTime,
                                        minutesBefore: minutesBefore,
                                    }
                                });
                            } catch (err) {
                                console.error('Error sending early-login notification:', err);
                            }

                            console.log(`📢 Notification queued/sent to ${recipientEmail}`);
                        }
                    }
                }

                console.log("✅ Early login check completed.");
            } catch (error) {
                console.error("❌ Error in early login checker:", error);
            }
        });

        console.log(
            "✅ Early login checker scheduler initialized (runs every 5 minutes)."
        );
    } catch (err) {
        console.error("Error initializing earlyLoginChecker:", err);
    }
};

module.exports = { earlyLoginChecker };
// Utility: check a specific employee's today's attendance for early login and notify
const checkEmployeeEarlyLogin = async (employeeId) => {
    try {
        const now = moment().tz("Asia/Kolkata");
        const currentYear = now.year();
        const currentMonth = now.month() + 1;
        const currentDay = now.date();

        const attendanceRecord = await AttendanceModel.findOne({ employeeObjID: employeeId }).populate("employeeObjID years.months.dates.shifts");
        if (!attendanceRecord) return { ok: false, message: "No attendance record" };

        const yearObject = attendanceRecord.years.find((y) => y.year === currentYear);
        if (!yearObject) return { ok: false, message: "No attendance for this year" };
        const monthObject = yearObject.months.find((m) => m.month === currentMonth);
        if (!monthObject) return { ok: false, message: "No attendance for this month" };
        const dateObject = monthObject.dates.find((d) => d.date === currentDay);
        if (!dateObject) return { ok: false, message: "No attendance for today" };

        if (!Array.isArray(dateObject.loginTimeMs) || dateObject.loginTimeMs.length === 0) return { ok: false, message: "No login entries" };

        // Determine assigned shift
        let assignedShift = null;
        if (dateObject.shifts && dateObject.shifts._id) assignedShift = dateObject.shifts;
        else if (typeof dateObject.shifts === "string") assignedShift = await Shift.findById(dateObject.shifts);
        if (!assignedShift || !assignedShift.startTime) return { ok: false, message: "No assigned shift" };

        const shiftStartMoment = moment(assignedShift.startTime, "HH:mm").tz("Asia/Kolkata");
        const shiftStartMinutes = Math.round(shiftStartMoment.valueOf() / 60000);

        const firstLoginMs = dateObject.loginTimeMs[0];
        const firstLoginTime = dateObject.loginTime[0];

        if (firstLoginMs < shiftStartMinutes) {
            const minutesBefore = shiftStartMinutes - firstLoginMs;
            const employee = attendanceRecord.employeeObjID;
            const recipientEmail = (employee.presonalEmail && employee.presonalEmail !== "N/A") ? employee.presonalEmail : employee.Email;

            // send notification
            await sendNotification({
                to: recipientEmail,
                subject: `Early login detected - your shift at ${shiftStartMoment.format("HH:mm")}`,
                templateVars: {
                    employeeName: `${employee.FirstName} ${employee.LastName}`,
                    shiftStartTime: shiftStartMoment.format("HH:mm"),
                    loginTime: firstLoginTime,
                    minutesBefore,
                }
            });

            // record attempt if not exists
            if (!dateObject.earlyLoginAttempts) dateObject.earlyLoginAttempts = [];
            if (!dateObject.earlyLoginAttempts.some(a => a.loginTimeMs === firstLoginMs)) {
                dateObject.earlyLoginAttempts.push({ loginTime: firstLoginTime, loginTimeMs: firstLoginMs, shiftStartTime: shiftStartMoment.format("HH:mm"), minutesBefore, checkedAt: now.format("HH:mm:ss"), employeeEmail: employee.Email, employeeName: `${employee.FirstName} ${employee.LastName}` });
                await attendanceRecord.save();
            }

            return { ok: true, notified: true, minutesBefore };
        }

        return { ok: true, notified: false, message: 'Login not early' };
    } catch (err) {
        console.error('checkEmployeeEarlyLogin error:', err);
        return { ok: false, message: 'error' };
    }
};

module.exports = { earlyLoginChecker, checkEmployeeEarlyLogin };
