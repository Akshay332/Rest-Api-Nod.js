const mongoose = require('mongoose')
const Schema = mongoose.Schema

const toursSchema = new Schema({
    images: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('destinations', toursSchema)