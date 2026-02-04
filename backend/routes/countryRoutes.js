const express = require('express');
const contery = express.Router();
// const countryController = require('../controllers/countryController');
const {verifyAdminHRManager,verifyAdmin} = require('../middleware/rbacMiddleware');
const { getAllCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
// GET: Retrieve all countries
// verifyAdminHR
contery.get("/country", verifyAdmin,getAllCountries);

// POST: Create a new country
contery.post("/country",verifyAdmin,  createCountry);

// PUT: Update an existing country
contery.put("/country/:id",verifyAdmin,  updateCountry);

// DELETE: Delete a country
contery.delete("/country/:id", verifyAdmin, deleteCountry);

module.exports = contery;