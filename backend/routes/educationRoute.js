const express = require("express");
const educationRoute = express.Router();

const {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation
} = require("../controllers/educationController");

const {verifyAll} = require('../middleware/rbacMiddleware');

// GET: Retrieve all countries

educationRoute.get("/education/:id",verifyAll, getAllEducation);

// POST: Create a new city
educationRoute.post("/education/:id",verifyAll, createEducation);

// PUT: Update an existing education
educationRoute.put("/education/:id", verifyAll,updateEducation);

// DELETE: Delete a education
educationRoute.delete("/education/:id/:id2",verifyAll, deleteEducation);

module.exports = educationRoute;
