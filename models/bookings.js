const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    hotel: {
                ID: { type: Schema.Types.ObjectId },
                name: { type: String }
    },
    bookRequestBy: {
               ID: { type: Schema.Types.ObjectId },
               name: {
                   type: String
               }
    },
    requestPending:{
        type: Boolean
    },
    requestAccepted: {
        type: Boolean
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    }
});



module.exports = mongoose.model('Booking', bookingSchema);
