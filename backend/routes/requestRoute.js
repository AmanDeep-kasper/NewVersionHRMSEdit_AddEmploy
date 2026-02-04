const express = require("express");
const requestRoute = express.Router();
const {verifyAll} = require('../middleware/rbacMiddleware');
const { createRequest, AllRequest,updateRequestStatus ,AllRequestRaised, getRequestProfiles} = require('../controllers/requestController')



requestRoute.post("/request", verifyAll, createRequest);
requestRoute.post("/requestList", verifyAll, AllRequest);
requestRoute.post("/requestRaised", verifyAll, AllRequestRaised);
requestRoute.post("/requestProfiles", verifyAll, getRequestProfiles);

requestRoute.post('/updateRequest', verifyAll, updateRequestStatus)

module.exports = requestRoute 
