const mongoose = require('mongoose');

// adding validation to the schema
const validate = require('mongoose-validator');

// creating the model schema
const Product = new mongoose.Schema({
    name: {
        type: String,
        validate: validate({ validator: 'isLength', arguments: [3, 50], message: 'Name length must be between 3 and 50' })
    },
    description: {
        type: String

    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    gallery: {
        type: String
    },
    itinerary: {
        type: String
    }
}, {
    timestamps: true
});

// exporting the model
module.exports = mongoose.model('product', Product);