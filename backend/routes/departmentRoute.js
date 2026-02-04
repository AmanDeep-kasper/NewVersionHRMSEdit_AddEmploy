

const express = require('express');
const departmentRoute = express.Router();

// const cityController = require('../controllers/cityController');
const { verifyAdminHR, verifyAdminHRManager } = require('../middleware/rbacMiddleware');

const { getAllDepartment, createDepartment, updateDepartment, deleteDepartment, getAllDepartmentsNameOnly, getAllDepartmentOnly } = require('../controllers/departmentController');

// GET: Retrieve all countries
// verifyHR
departmentRoute.get("/department", verifyAdminHRManager, getAllDepartment);
departmentRoute.get(
  "/departmentName",
  verifyAdminHRManager,
  getAllDepartmentOnly
);

// POST: Create a new city
departmentRoute.post("/department", verifyAdminHR, createDepartment);

// PUT: Update an existing city

departmentRoute.put("/department/:id", verifyAdminHR, updateDepartment);

// DELETE: Delete a city

departmentRoute.delete("/department/:id", verifyAdminHR, deleteDepartment);

module.exports = departmentRoute;