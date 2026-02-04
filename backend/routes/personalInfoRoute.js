const express = require("express");
const personalInfoRoute = express.Router();

const {verifyAll} = require('../middleware/rbacMiddleware');


const {
  personalInfo,
  updatepersonalInfo
} = require("../controllers/personalInfoController");

// GET: Retrieve all personalInfo

personalInfoRoute.get(
  "/personal-info/:id",
  verifyAll,
  personalInfo
);

// PUT: Update an existing personalInfo
personalInfoRoute.put(
  "/personal-info/:id",
  verifyAll,
  updatepersonalInfo
);

module.exports = personalInfoRoute;
