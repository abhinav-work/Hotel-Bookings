const express = require('express');
const router = express.Router();
const hotelController = require('../Controllers/hotel')
const isAuth = require('../Middleware/is_auth');
const isCustom = require('../Middleware/is_customer')

router.get('/', hotelController.getHotels);

router.post('/bookingRequest', isAuth, isCustom, hotelController.postBookingRequest)
router.get('/bookingRequest', isAuth, isCustom, hotelController.getBookingRequests)

module.exports = router;