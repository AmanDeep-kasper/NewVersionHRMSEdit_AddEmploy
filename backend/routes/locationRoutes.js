const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const {  verifyAll} = require('../middleware/rbacMiddleware');
router.post('/locations',verifyAll, locationController.createLocation);
router.get('/locations', verifyAll,  locationController.getAllLocations);

module.exports = router;
