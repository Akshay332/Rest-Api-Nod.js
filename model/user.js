const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

//User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
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

UserSchema.virtual('hotel', {
    ref: 'Hotel',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
        //  delete userObject.avatar

    return userObject
}

UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse', { expiresIn: 604800 })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unbale to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Hash the plain text password before saving
UserSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {

        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = module.exports = mongoose.model('User', UserSchema)

// //Find the user by ID
// module.exports.getUserById = function(id, callback) {
//     User.findById(id, callback)
// }

// //Find the user by Its username
// module.exports.getUserByUsername = function(username, callback) {
//     const query = {
//         username: username
//     }
//     User.findOne(query, callback)
// }

// //Find the user by  its email
// module.exports.getUserByEmail = function(email, callback) {
//     const query = {
//         email: email
//     }
//     User.findOne(query, callback)
// }

// //to Register the user
// module.exports.addUser = function(newUser, callback) {
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) return err
//             newUser.password = hash
//             newUser.save(callback)
//         })
//     })
// }

// //Compare Password
// module.exports.comparePassword = function(password, hash, callback) {
//     bcrypt.compare(password, hash, (err, isMatch) => {
//         if (err) throw err
//         callback(null, isMatch)
//     })
// }