
const express = require('express');
const stateRoute = express.Router();

// const stateController = require('../controllers/stateController');
const {verifyAdmin} = require('../middleware/rbacMiddleware');
const { getAllStates, createState, updateState, deleteState } = require('../controllers/stateControler');

// GET: Retrieve all countries
// verifyAdminHR
stateRoute.get("/state/:id?",verifyAdmin, getAllStates);

// POST: Create a new state
stateRoute.post("/state", verifyAdmin, createState);

// PUT: Update an existing state
stateRoute.put("/state/:id",verifyAdmin,updateState);

// DELETE: Delete a state
stateRoute.delete("/state/:id",verifyAdmin,deleteState);

module.exports = stateRoute;