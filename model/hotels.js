const mongoose = require('mongoose');


// creating the model schema
const Hotel = new mongoose.Schema({


    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    images: {
        type: String
    }
}, {
    timestamps: true
});

// exporting the model
module.exports = mongoose.model('hotel', Hotel);