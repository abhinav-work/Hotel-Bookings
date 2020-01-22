const express = require('express');
const router = express.Router();
const path = require('path');
const productsController = require('../Controllers/admin');
const isAuth = require('../Middleware/is_auth');
const isMaster = require('../Middleware/is_master');
const { check, body } = require('express-validator/check');
const User= require('../models/user');

router.get('/hotels', isAuth, isMaster, productsController.getAdminHotels);
router.get('/addhotel', isAuth, isMaster, productsController.getAddHotel);
router.post('/add-hotel', 
                            [   
                                body('title', 'Enter a valid Title')
                                    .isLength({ min: 3 })
                                    .isString(),
                                body('price', 'Enter a valid Price').isFloat(),
                                body('description', 'Enter a valid Description').isLength({ min: 5, max: 400 }).isString()
                            ], 
                            isAuth, isMaster, productsController.postAddHotel);
router.get('/edit-hotel/:hotelID', isAuth, isMaster, productsController.getEditHotel);


router.post('/edit-hotel/', 
                            [
                                body('title', 'Enter a valid Title')
                                .isString()
                                .isLength({ min: 3 }),
                               body('price', 'Enter a valid Price').isFloat(),
                                body('description', 'Enter a valid Description')
                                        .isString()
                                        .isLength({ min: 5, max: 400 })
                            ],
                            isAuth, isMaster, productsController.postEditHotel);
router.delete('/delete-hotel/:hotelID', isAuth, isMaster, productsController.deleteHotel);
router.get('/bookingRequests', isAuth, isMaster, productsController.getBookingRequests);
router.post('/acceptRequest/:bookingID', isAuth, isMaster, productsController.postAcceptRequest)
router.post('/rejectRequest/:bookingID', isAuth, isMaster, productsController.postRejectRequest)
module.exports = router;