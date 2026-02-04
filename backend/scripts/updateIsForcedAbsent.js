const mongoose = require("mongoose"); // Added mongoose import
const { AttendanceModel } = require("../models/attendanceModel");
const dotenv = require("dotenv")
dotenv.config({ path: '../.env' })

async function updateIsForcedAbsent() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(
      process.env.DATABASEURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Step 1: Verify collection name
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in database:", collections.map((c) => c.name));

    // Step 2: Check total documents in the collection
    const totalDocuments = await AttendanceModel.countDocuments();
    console.log(`Total documents in Attendance collection: ${totalDocuments}`);

    if (totalDocuments === 0) {
      console.log("No documents found in the collection. Please add documents to update.");
      return;
    }

    // Step 3: Check for documents with years.months.dates
    const documentsWithDates = await AttendanceModel.find({
      "years.months.dates": { $exists: true },
    }).limit(1);
    console.log(`Documents with years.months.dates: ${documentsWithDates.length}`);
    if (documentsWithDates.length > 0) {
      console.log(
        "Sample document structure:",
        JSON.stringify(documentsWithDates[0].years[0]?.months[0]?.dates[0] || {}, null, 2)
      );
    } else {
      console.log("No documents with years.months.dates found. Cannot update isForcedAbsent.");
      return;
    }

    // Step 4: Find documents where isForcedAbsent is missing
    const documentsToUpdate = await AttendanceModel.find({
      "years.months.dates.isForcedAbsent": { $exists: false },
    });
    console.log(`Documents needing isForcedAbsent update: ${documentsToUpdate.length}`);

    if (documentsToUpdate.length === 0) {
      console.log("No documents need updating. Checking if isForcedAbsent already exists...");
      const docWithForcedAbsent = await AttendanceModel.findOne({
        "years.months.dates.isForcedAbsent": { $exists: true },
      });
      if (docWithForcedAbsent) {
        console.log(
          "isForcedAbsent already exists in some documents. Sample:",
          JSON.stringify(docWithForcedAbsent.years[0].months[0].dates[0], null, 2)
        );
      } else {
        console.log(
          "No documents have isForcedAbsent, and no documents match the update criteria. Verify data structure."
        );
      }
      return;
    }

    // Step 5: Update documents to add isForcedAbsent
    const result = await AttendanceModel.updateMany(
      { "years.months.dates.isForcedAbsent": { $exists: false } },
      { $set: { "years.$[].months.$[].dates.$[].isForcedAbsent": false } }
    );
    console.log(`Update result: Matched ${result.matchedCount}, Modified ${result.modifiedCount} documents`);

    // Step 6: Verify the update
    const updatedDoc = await AttendanceModel.findOne({
      "years.months.dates.isForcedAbsent": { $exists: true },
    });
    if (updatedDoc) {
      console.log(
        "Sample updated document:",
        JSON.stringify(updatedDoc.years[0].months[0].dates[0], null, 2)
      );
    } else {
      console.log("No documents found with isForcedAbsent after update. Check data structure or query.");
    }
  } catch (error) {
    console.error("Error during migration:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

updateIsForcedAbsent();