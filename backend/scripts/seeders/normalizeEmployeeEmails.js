const mongoose = require("mongoose");
const { Employee } = require("../../models/employeeModel");
const connectToDatabase = require("../../dbConnection/dbconnect");

const normalize = (value) => {
  if (!value || typeof value !== "string") return value;
  return value.toLowerCase().trim();
};

const runSeeder = async () => {
  try {
    await connectToDatabase();
    console.log("✅ MongoDB connected");

    const employees = await Employee.find({});
    console.log(`🔍 Found ${employees.length} employees`);

    let updatedCount = 0;

    for (const emp of employees) {
      let isModified = false;

      // Normalize Email
      if (emp.Email) {
        const normalizedEmail = normalize(emp.Email);
        if (emp.Email !== normalizedEmail) {
          emp.Email = normalizedEmail;
          isModified = true;
        }
      }

      // Normalize reportManager
      if (emp.reportManager) {
        const normalizedManager = normalize(emp.reportManager);
        if (emp.reportManager !== normalizedManager) {
          emp.reportManager = normalizedManager;
          isModified = true;
        }
      }

      // Normalize reportHr
      if (emp.reportHr) {
        const normalizedHr = normalize(emp.reportHr);
        if (emp.reportHr !== normalizedHr) {
          emp.reportHr = normalizedHr;
          isModified = true;
        }
      }

      if (isModified) {
        await emp.save();
        updatedCount++;
      }
    }

    console.log(`✅ Seeder completed. Updated ${updatedCount} employees`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
};

runSeeder();
