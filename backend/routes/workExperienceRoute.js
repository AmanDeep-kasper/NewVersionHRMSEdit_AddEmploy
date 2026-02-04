const express = require("express");
const workExperienceRoute = express.Router();

const { verifyAll } = require("../middleware/rbacMiddleware");

const {
  getAllWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
} = require("../controllers/workExperienceController");

// GET: Retrieve all countries
workExperienceRoute.get(
  "/work-experience/:id",
  verifyAll,
  getAllWorkExperience
);

// POST: Create a new city
workExperienceRoute.post(
  "/work-experience/:id",
  verifyAll,
  createWorkExperience
);

// PUT: Update an existing work
workExperienceRoute.put(
  "/work-experience/:id",
  verifyAll,
  updateWorkExperience
);

// DELETE: Delete a work
workExperienceRoute.delete(
  "/work-experience/:id/:id2",
  verifyAll,
  deleteWorkExperience
);

module.exports = workExperienceRoute;
