const mongoose = require("mongoose");
const dotenv = require("dotenv")
const { Employee } = require("../models/employeeModel"); 
dotenv.config({ path: '../.env' })

async function updateEmployeeFields() {
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
    const totalDocuments = await Employee.countDocuments();
    console.log(`Total documents in Employee collection: ${totalDocuments}`);

    if (totalDocuments === 0) {
      console.log("No documents found in the collection. Please add documents to update.");
      return;
    }

    // Step 3: Find documents missing allowMobileLogin or isFullandFinal, or with allowMobileLogin: null
    const documentsToUpdate = await Employee.find({
      $or: [
        { allowMobileLogin: { $exists: false } },
        { isFullandFinal: { $exists: false } },
        { allowMobileLogin: null },
      ],
    });
    console.log(`Documents needing update for allowMobileLogin or isFullandFinal: ${documentsToUpdate.length}`);

    if (documentsToUpdate.length === 0) {
      console.log("No documents need updating. Checking if fields already exist...");
      const docWithFields = await Employee.findOne({
        $and: [
          { allowMobileLogin: { $exists: true } },
          { isFullandFinal: { $exists: true } },
        ],
      });
      if (docWithFields) {
        console.log(
          "Fields already exist in some documents. Sample:",
          JSON.stringify(
            {
              allowMobileLogin: docWithFields.allowMobileLogin,
              isFullandFinal: docWithFields.isFullandFinal,
            },
            null,
            2
          )
        );
      } else {
        console.log("No documents have allowMobileLogin or isFullandFinal. Verify data structure.");
      }
      return;
    }

    // Step 4: Update documents in two steps
    // 4a: Set allowMobileLogin to "Not Allowed" where it is null
    const nullUpdateResult = await Employee.updateMany(
      { allowMobileLogin: null },
      { $set: { allowMobileLogin: "Not Allowed" } }
    );
    console.log(
      `Null update: Matched ${nullUpdateResult.matchedCount}, Modified ${nullUpdateResult.modifiedCount} documents`
    );

    // 4b: Set default values for missing fields
    const missingFieldsUpdateResult = await Employee.updateMany(
      {
        $or: [
          { allowMobileLogin: { $exists: false } },
          { isFullandFinal: { $exists: false } },
        ],
      },
      {
        $set: {
          allowMobileLogin: "Not Allowed",
          isFullandFinal: "No",
        },
      }
    );
    console.log(
      `Missing fields update: Matched ${missingFieldsUpdateResult.matchedCount}, Modified ${missingFieldsUpdateResult.modifiedCount} documents`
    );

    // Step 5: Verify the update
    const updatedDoc = await Employee.findOne({
      $and: [
        { allowMobileLogin: { $exists: true } },
        { isFullandFinal: { $exists: true } },
      ],
    });
    if (updatedDoc) {
      console.log(
        "Sample updated document:",
        JSON.stringify(
          {
            allowMobileLogin: updatedDoc.allowMobileLogin,
            isFullandFinal: updatedDoc.isFullandFinal,
          },
          null,
          2
        )
      );
    } else {
      console.log("No documents found with allowMobileLogin or isFullandFinal after update.");
    }

  } catch (error) {
    console.error("Error during migration:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

updateEmployeeFields();