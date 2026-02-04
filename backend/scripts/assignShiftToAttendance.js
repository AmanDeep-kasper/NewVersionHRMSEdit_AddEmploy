const mongoose = require("mongoose");
const connectDB = require("../dbConnection/dbconnect");
const { AttendanceModel } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");
const Shift = require("../models/ShiftModel");

const assignShiftToAttendance = async (shiftId) => {
  try {
    await connectDB();

    const shiftExists = await Shift.findById(shiftId);

    if (!shiftExists) {
      console.error("Shift not found");
      return;
    }

    const employees = await Employee.find();
    if (employees.length === 0) {
      console.error("No employees found.");
      return;
    }

    console.log(`Found ${employees.length} employees. Processing...`);

    let attendanceUpdatedCount = 0;

    for (const employee of employees) {
      console.log(`Processing attendance for employee: ${employee._id}`);

      const attendance = await AttendanceModel.findOne({
        employeeObjID: employee._id,
      });

      if (!attendance) {
        console.log(
          `No attendance record found for employee: ${employee.FirstName} ${employee.LastName}`
        );
        continue;
      }

      let shiftAssigned = false;

      // Traverse attendance structure and assign the shift to unassigned dates
      for (const yearData of attendance.years) {
        for (const monthData of yearData.months) {
          for (const dateData of monthData.dates) {
            if (!Array.isArray(dateData.shifts)) {
              dateData.shifts = [];
            }

            // Append shiftId if not already present
            if (!dateData.shifts.includes(shiftId)) {
              dateData.shifts.push(shiftId);
              shiftAssigned = true;
            }
          }
        }
      }

      if (shiftAssigned) {
        const result = await attendance.save();
        console.log(
          `Attendance updated for employee: ${employee.FirstName} ${employee.LastName}. Updated record:`,
          result
        );
        attendanceUpdatedCount++;
      } else {
        console.log(
          `No unassigned dates found for employee: ${employee.FirstName} ${employee.LastName}`
        );
      }
    }

    console.log(
      `Shift assignment completed for ${attendanceUpdatedCount} attendance records.`
    );
  } catch (error) {
    console.error("Error assigning shifts to attendance:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

(async () => {
  const shiftId = "6763beb4a7a6fd1f58ceb5ab";
  await assignShiftToAttendance(shiftId);
})();
