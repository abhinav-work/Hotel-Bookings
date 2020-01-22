const Hotels = require('../models/hotels');
const User = require('../models/user');
const Bookings = require('../models/bookings')
const ITEMS_PER_PAGE = 4; 

exports.getHotels = (req, res, next) => {
    const page = +req.query.page || 1;
    var totalItems;
    Hotels.find()
                .countDocuments()
                .then(num => {
                        totalItems = num;
                        console.log(totalItems)
                        return Hotels.find()
                                        .skip((page-1) * ITEMS_PER_PAGE)
                                        .limit(ITEMS_PER_PAGE)
                })
                .then(hotels => {
                    res.render('user/hotel-list', {
                        hotels: hotels,
                        pageTitle: "Hotels",
                        totalBlogs: totalItems,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page>1,
                        nextPage: page+1,
                        previousPage: page-1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                        currentPage: page
                    });
                })
            .catch(err => {
                console.log(err)
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error)
            });
};



exports.postBookingRequest = (req, res, next) => {
    const hotelID = req.body.hotelID;
    const userID = req.user._id;
    User.findById(userID)
        .then(user=> {
                        Hotels.findById(hotelID)
                                .then(hotel => {
                                                    const newBookingRequest = new Bookings({
                                                        'hotel.ID': hotel._id,
                                                        'hotel.name': hotel.title,
                                                        'bookRequestBy.ID': user._id,
                                                        'bookRequestBy.name': user.first_name + " " + user.last_name,
                                                        requestPending: true,
                                                        requestAccepted: false,
                                                        created_at: Date.now(),
                                                        updated_at: Date.now()
                                                    })

                                                    newBookingRequest.save()
                                                        .then(result => {
                                                            console.log(result)
                                                            res.redirect('/bookingRequest')
                                                        })
                                                        .catch(err => {
                                                            console.log(err)
                                                        })
                                })
                                .catch(err => console.log(err))
                         
        })
        .catch(err => {
                    console.log(err)
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error)
        })
}

exports.getBookingRequests = (req, res, next) => {
      const page = +req.query.page || 1;
      var totalItems;
    Bookings.find( {'bookRequestBy._id': req.user_id} )
            .countDocuments()
                .then(num => {
                    totalItems = num;
                    console.log(totalItems)
                    return Bookings.find( {'bookRequestBy._id': req.user_id} )
                        .skip((page - 1) * ITEMS_PER_PAGE)
                        .limit(ITEMS_PER_PAGE)
                })
            .then(bookings => {
                                res.render('user/booking-requests', {
                                                                        bookings: bookings,
                                                                        pageTitle: "Bookings",
                                                                        totalBlogs: totalItems,
                                                                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                                                                        hasPreviousPage: page > 1,
                                                                        nextPage: page + 1,
                                                                        previousPage: page - 1,
                                                                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                                                                        currentPage: page
                                })
            })
}