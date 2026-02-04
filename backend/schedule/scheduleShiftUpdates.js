const cron = require("node-cron");
const mongoose = require("mongoose");
const { Employee } = require("../models/employeeModel");

const scheduleShiftUpdates = () => {
  cron.schedule("28 10 * * *", async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      console.log(`🔍 Checking for scheduled shift updates on ${today}...`);

      // ✅ Fetch employees with scheduled shift updates for today
      const employees = await Employee.find({
        "scheduledShiftChange.effectiveDate": today,
        "scheduledShiftChange.shift": { $exists: true }
      });

      if (!employees.length) {
        console.log("⚠️ No scheduled shift updates for today.");
        return;
      }

      // ✅ Prepare bulk update operations
      const bulkUpdates = employees.map((employee) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(employee._id) },
          update: {
            $set: { shifts: [employee.scheduledShiftChange.shift] },
            $push: { shiftHistory: { shift: employee.scheduledShiftChange.shift, updatedOn: new Date() } },
            $unset: { scheduledShiftChange: "" }
          }
        }
      }));

      // ✅ Apply bulk updates
      const result = await Employee.bulkWrite(bulkUpdates);

      console.log(`✅ Shift updates applied for ${result.modifiedCount} employees on ${today}`);

      // ✅ Log updated employees
      console.log("\n📝 Employees whose shifts were updated:");
      employees.forEach((emp) => {
        console.log(`🔹 ${emp.FirstName} ${emp.LastName} (ID: ${emp._id}) → New Shift: ${emp.scheduledShiftChange.shift}`);
      });

    } catch (error) {
      console.error("❌ Error applying scheduled shifts:", error);
    }
  });

  console.log("✅ Shift update scheduler is running...");
};

module.exports = scheduleShiftUpdates;
