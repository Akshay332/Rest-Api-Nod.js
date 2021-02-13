const mongoose = require('mongoose')
const Schema = mongoose.Schema

const destinatonsSchema = new Schema({
    images: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('destinations', destinatonsSchema)