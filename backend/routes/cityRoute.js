const express = require("express");
const cityRoute = express.Router();

// const cityController = require('../controllers/cityController');
const {verifyAdmin,verifyAdminHR} = require('../middleware/rbacMiddleware');
const {
  getAllcity,
  createCity,
  updateCity,
  deleteCity
} = require("../controllers/cityController");

// GET: Retrieve all countries
// verifyAdminHR
cityRoute.get("/city", verifyAdmin, getAllcity);

// POST: Create a new city
cityRoute.post("/city",verifyAdmin, createCity);

// PUT: Update an existing city
cityRoute.put("/city/:id",verifyAdmin, updateCity);

// DELETE: Delete a city
cityRoute.delete("/city/:id",verifyAdmin, deleteCity);

module.exports = cityRoute;
