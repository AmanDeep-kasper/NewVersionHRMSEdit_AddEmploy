const express = require('express');
const companyRoute = express.Router();

// const companyController = require('../controllers/companyController');
const {verifyAdmin,verifyAdminHR} = require('../middleware/rbacMiddleware');


const { getAllCompanyDetails, createCompany, updateCompanyDtails,deleteCompanyDetails } = require('../controllers/compnayController');

// verifyHR
// GET: Retrieve all company
companyRoute.get("/company",verifyAdminHR, getAllCompanyDetails);
companyRoute.get("/CompanyDetails", verifyAdminHR,  getAllCompanyDetails);

// POST: Create a new company
companyRoute.post("/company",verifyAdmin, createCompany);

// PUT: Update an existing company
companyRoute.put("/company/:id",verifyAdmin, updateCompanyDtails);

companyRoute.delete("/company/:id",verifyAdmin, deleteCompanyDetails )

module.exports = companyRoute;