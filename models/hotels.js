const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image_URL:{
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId
    },
    price:{
        type: Number
    },
    quantity: {
        type: Number
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



module.exports = mongoose.model('Hotels', hotelSchema);

