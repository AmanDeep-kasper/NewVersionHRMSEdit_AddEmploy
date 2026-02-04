


const express = require('express');
const roleRoute = express.Router();

// const cityController = require('../controllers/cityController');
const {verifyAdminHR,verifyAdminHRManager} = require('../middleware/rbacMiddleware');

const { getAllRole, createRole, updateRole, deleteRole } = require('../controllers/roleController');

// GET: Retrieve all countries
// verifyHR
roleRoute.get("/role", verifyAdminHR, getAllRole);

// POST: Create a new city
roleRoute.post("/role", verifyAdminHR,createRole);

// PUT: Update an existing city
roleRoute.put("/role/:id",verifyAdminHR,  updateRole);

// DELETE: Delete a city
roleRoute.delete("/role/:id", verifyAdminHR,deleteRole);

module.exports = roleRoute;