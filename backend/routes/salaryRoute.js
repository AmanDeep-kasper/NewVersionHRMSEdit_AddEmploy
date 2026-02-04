
const express = require('express');
const salaryRoute = express.Router();

const {verifyAdminHR} = require('../middleware/rbacMiddleware');
const { deleteSalary, updateSalary, createSalary, getAllSalary } = require('../controllers/salaryController');

// GET: Retrieve all countries
salaryRoute.get("/salary",verifyAdminHR, getAllSalary);

// POST: Create a new city
salaryRoute.post("/salary/:id",verifyAdminHR,createSalary);

// PUT: Update an existing salary
salaryRoute.put("/salary/:id",verifyAdminHR,updateSalary);

// DELETE: Delete a salary
salaryRoute.delete("/salary/:id/",verifyAdminHR, deleteSalary);

module.exports = salaryRoute;