const express = require("express");
const familyRoute = express.Router();

const { verifyAll } = require("../middleware/rbacMiddleware");

const {
  getAllFamily,
  createFamily,
  updateFamily,
  deleteFamily,
} = require("../controllers/familyController");

// GET: Retrieve all countries
familyRoute.get("/family-info/:id", verifyAll, getAllFamily);

// POST: Create a new family
familyRoute.post("/family-info/:id", verifyAll, createFamily);

// PUT: Update an existing family
familyRoute.put("/family-info/:id", verifyAll, updateFamily);

// DELETE: Delete a family
familyRoute.delete("/family-info/:id/:id2", deleteFamily);

module.exports = familyRoute;
