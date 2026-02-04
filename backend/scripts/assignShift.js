const mongoose = require("mongoose");
const connectDB = require("../dbConnection/dbconnect");
const Employee = require("../models/employeeModel").Employee;
const Shift = require("../models/ShiftModel");

const assignShiftToUsersWithoutShift = async (shiftId) => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Verifying Employee model...");
    console.log(Employee);

    const shiftExists = await Shift.findById(shiftId);
    console.log("Shift exists:", shiftExists);
    if (!shiftExists) {
      console.error("Shift not found");
      return;
    }

    console.log("Checking for employees without shifts...");
    const employeesWithoutShift = await Employee.find({
      $or: [
        { shifts: { $exists: false } }, // No shifts field
        { shifts: { $exists: true, $size: 0 } }, // Empty shifts array
      ],
    });

    console.log("Employees without shifts:", employeesWithoutShift.length);

    if (employeesWithoutShift.length === 0) {
      console.log("No employees found without shifts.");
      return;
    }

    // Update each employee one by one
    for (let employee of employeesWithoutShift) {
      console.log("Updating employee:", employee._id);
      employee.shifts.push(shiftId);
      await employee.save();
    }

    console.log(
      `${employeesWithoutShift.length} employees were updated with the new shift.`
    );
  } catch (error) {
    console.error("Error assigning shifts:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

(async () => {
  const shiftId = "6763be9ba7a6fd1f58ceb5a8"; // Ensure this shift ID exists in the database
  await assignShiftToUsersWithoutShift(shiftId);
})();
