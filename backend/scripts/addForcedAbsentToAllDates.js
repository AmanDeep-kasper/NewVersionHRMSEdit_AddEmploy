const mongoose = require("mongoose");
const { AttendanceModel } = require("../models/attendanceModel"); 
const dotenv = require("dotenv")
dotenv.config({ path: '../.env' })

async function addForcedAbsentToAllDates() {
  const all = await AttendanceModel.find({});

  for (const record of all) {
    let modified = false;

    record.years.forEach((year) => {
      year.months.forEach((month) => {
        month.dates.forEach((date) => {
          if (typeof date.isForcedAbsent !== "boolean") {
            date.isForcedAbsent = false;
            modified = true;
          }
        });
      });
    });

    if (modified) {
      await record.save();
      console.log(`Updated attendance for employeeObjID: ${record.employeeObjID}`);
    }
  }

  console.log("Backfill complete.");
  mongoose.disconnect();
}

mongoose.connect(process.env.DATABASEURL,).then(() => {
  console.log("Connected to MongoDB");
  addForcedAbsentToAllDates();
});
