var Hotel = require('../models/hotels');
var User = require('../models/user');
const Bookings = require('../models/bookings')

const { validationResult } = require('express-validator/check')
const ITEMS_PER_PAGE = 4;


exports.getAddHotel = (req, res, next) => {
    res.render('admin/edit-hotel',
        { pageTitle: 'Add Hotel',
            editing: false,
            hasError: false,
            errorMessage: null,
            validationErr: []
        }
    );
};

exports.postAddHotel = (req, res, next) => 
{
    const title = req.body.title;
    console.log(title);
    const image_URL = req.body.image_URL
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);
    

     if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-hotel', {
             pageTitle: 'Add Hotel',
             editing: false,
             hasError: true,
             hotel: {
                 title : title,
                 description: description,
                 price: price,
             },
             errorMessage: errors.array()[0].msg,
             validationErr: errors.array()
         });
     }

        
           
            const hotel = new Hotel({
                title: title, 
                image_URL: image_URL,
                description: description, 
                author: req.user,
                created_at: Date.now(),
                updated_at: Date.now(),
                price: price
               });
             console.log(hotel)
            hotel.save()
                    .then(result => {
                            console.log("Added a Hotel Successfully");
                           
                            res.redirect("/");
                        })
                    .catch(err => {
                        console.log(err)
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error)
                    });
};

exports.getEditHotel = (req, res, next) => {
    const editMode= req.query.edit;
    if(editMode!="true"){
        return res.redirect('/')
    }
    const hotelID = req.params.hotelID;

    Hotel.findById({_id: hotelID})
            .then(hotel => {
                                console.log(hotel)
                                if(!hotel)
                                {
                                    res.redirect('/')
                                }
                                res.render('admin/edit-hotel',{
                                        pageTitle: 'Edit Hotel',
                                        editing: editMode,
                                        hasError: false,
                                        hotel: hotel,
                                        errorMessage: null,
                                        validationErr: []
                                         });
                        })
            .catch(err => {
                console.log(err)
                  const error = new Error(err);
                  error.httpStatusCode = 500;
                  return next(error)
            });
};

exports.postEditHotel = (req, res, next) => {
    const hotelID = req.body.hotelID
    const updatedTitle = req.body.title;
    const updatedImage_URL = req.body.image_URL;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         //console.log(errors.array())
         return res.status(422).render('admin/edit-hotel', {
                                                                pageTitle: 'Edit Hotel',
                                                                editing: true,
                                                                hasError: true,
                                                                hotel: {
                                                                    title: updatedTitle,
                                                                    image_URL: updatedImage_URL,
                                                                    description: updatedDescription,
                                                                    price: updatedPrice,
                                                                    _id: hotelID
                                                                 },
                                                                    errorMessage: errors.array()[0].msg,
                                                                    validationErr: errors.array()
         });
     }
    
    
    
    Hotel.findById(hotelID)
                .then(hotel => {
                                        if(hotel.author.toString()!==req.user._id.toString())
                                        {
                                            return res.redirect('/')
                                        }
                                       
                                        console.log(req.user._id)
                                        hotel.title = updatedTitle
                                        hotel.image_URL = updatedImage_URL;
                                        hotel.description = updatedDescription;
                                        hotel.updated_at = Date.now();
                                        hotel.author = req.user;
                                        hotel.price = updatedPrice;
                                        
                                        return hotel.save()
                                                        .then(result => {
                                                            res.redirect('/');
                                                        })
                                                        .catch(err =>  console.log(err))
                })
                .catch(err => {
                    console.log(err)
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error)
                });
};

exports.getAdminHotels = (req, res, next) => {
    const page = +req.query.page || 1;
    var totalItems;
    Hotel.find()
        .countDocuments()
        .then(num => {
            totalItems = num;
           // console.log(totalItems)
            return Hotel.find({ author: req.user._id })
                            .skip((page - 1) * ITEMS_PER_PAGE)
                            .limit(ITEMS_PER_PAGE)  
        })
        .then(hotels => {
                                res.render('admin/hotels', {
                                    hotels: hotels,
                                    pageTitle: "Admin Hotels",
                                    totalBlogs: totalItems,
                                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                                        hasPreviousPage: page > 1,
                                        nextPage: page + 1,
                                        previousPage: page - 1,
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

exports.deleteHotel = (req, res, next) => {
     var currentPage = +req.query.page || 1;
    const hotelID = req.params.hotelID;
    Hotel.findById(hotelID)
                .then(hotel => {     
                                    console.log('Deleting Hotel')
                                    return Hotel
                                        .deleteOne({
                                            _id: hotelID,
                                             author: req.user._id
                                        })
                                        
                })
               .then(hotel => {
                   console.log("Deleting Booking")
                   Bookings.findOneAndRemove({'hotel.ID': hotelID})
                            .then(result => {
                                                 res.status(200).json({message: 'Success!!'});
                            })
                    
               })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({message: "Deletion of the hotel failed!"})
                });
    };

exports.getBookingRequests = (req, res, next) => {
    const page = +req.query.page || 1;
    var totalItems;
    Bookings.find( { requestPending: "true" } )
        .countDocuments()
        .then(num => {
            totalItems = num;
            console.log(totalItems)
            return Bookings.find({ requestPending: "true" })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(bookings => {
            res.render('admin/booking-requests', {
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
        .catch(err => {
            console.log(err)
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        });
}
exports.postAcceptRequest = (req, res, next) => {
    const bookingID = req.params.bookingID;
    Bookings.findById(bookingID)
                .then(booking => {
                                    booking.requestPending = false;
                                    booking.requestAccepted = true;
                                    booking.updated_at = Date.now();
                                    booking.save()
                                            .then(result => {
                                                                     res.redirect('/admin/bookingRequests');
                                            })      
                                            .catch(err => console.log(err))
                                   
                })
                .catch(err => {
                    console.log(err)
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error)
                });
} 
exports.postRejectRequest = (req, res, next) => {
    const bookingID = req.params.bookingID;
    Bookings.findById(bookingID)
        .then(booking => {
            booking.requestPending = false;
            booking.requestAccepted = false;
            booking.updated_at = Date.now();
            booking.save()
                .then(result => {
                    res.redirect('/admin/bookingRequests');
                })
                .catch(err => console.log(err))

        })
        .catch(err => {
            console.log(err)
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        });
}