const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')


//Admin Schema
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    avatar:{
        type: String,

    },
    password: {
        type: String,
        required: true,
        trim: true
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

}, {
    timestamps: true
})

AdminSchema.virtual('hotel', {
    ref: 'Hotel',
    localField: '_id',
    foreignField: 'owner'
})


AdminSchema.methods.toJSON = function() {
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens
        // delete adminObject.avatar

    return adminObject
}

AdminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, 'thisismynewcourse', { expiresIn: 604800 })
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()

    return token
}

AdminSchema.statics.findByCredentials = async(email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error('Unbale to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return admin
}

//Hash the plain text password before saving
AdminSchema.pre('save', async function(next) {
    const admin = this

    if (admin.isModified('password')) {

        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

const Admin = module.exports = mongoose.model('Admin', AdminSchema)