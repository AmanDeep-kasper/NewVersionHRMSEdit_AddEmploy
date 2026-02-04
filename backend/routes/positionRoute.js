

const express = require('express');
const positionRoute = express.Router();

// const cityController = require('../controllers/cityController');
const {verifyAdminHR} = require('../middleware/rbacMiddleware');


const { getAllEmployerPosition, createEmployerPosition, updateEmployerPosition, deleteEmployerPosition } = require('../controllers/positionController');

// GET: Retrieve all countries
// verifyHR
positionRoute.get("/position",verifyAdminHR,  getAllEmployerPosition);

// POST: Create a new city
positionRoute.post("/position",verifyAdminHR,  createEmployerPosition);

// PUT: Update an existing city
positionRoute.put("/position/:id",verifyAdminHR,   updateEmployerPosition);

// DELETE: Delete a city
positionRoute.delete("/position/:id",verifyAdminHR, deleteEmployerPosition);

module.exports = positionRoute;