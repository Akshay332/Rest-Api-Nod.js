const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cabsSchema = new Schema({
    images: {
        type: String
    },
    title: {
        type: String
    },
    price: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('cabs', cabsSchema)