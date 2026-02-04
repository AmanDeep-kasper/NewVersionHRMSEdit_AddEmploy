const mongoose = require("mongoose");
require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in the .env file!");
  process.exit(1);
}

const mongoURI = process.env.MONGO_URI;

const connectToDatabase = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("🔍 Error Message:", error.message);

    if (error.code === "ENOTFOUND" || error.message.includes("ESERVFAIL")) {
      console.error("❗ DNS Lookup Failed");
      console.error("➡ Use Google DNS 8.8.8.8 / Cloudflare 1.1.1.1");
      console.error("➡ Check MongoDB Atlas IP whitelist");
    }

    console.log("🔁 Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectToDatabase, 5000);
  }
};

module.exports = connectToDatabase;
