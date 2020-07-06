const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail } = require('../emails/account')

//Create users

router.post('/register', async(req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

})

//Login user
router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//Logout user
router.post('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Read user profile when he is logged in
router.get('/read/profile', auth, async(req, res) => {
    res.send(req.user)
})

//Read users by id
router.get('/read/:userId', async(req, res) => {
    const _id = req.params.userId
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//Read all users
router.get('/allusers', (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

//Update user 
router.patch('/update/profile', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'contact']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete user profile
router.delete('/delete/profile', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// router.post('/login', (req, res) => {
//     const email = req.body.email
//     const username = req.body.username
//     const password = req.body.password
//     if (email) {
//         User.getUserByEmail(email, (err, user) => {
//             if (err) throw err
//             if (!user) {
//                 return res.json({
//                     success: false,
//                     message: "User not found."
//                 })
//             }

//             User.comparePassword(password, user.password, (err, isMatch) => {
//                 if (err) throw err
//                 if (isMatch) {
//                     const token = jwt.sign({
//                         type: "user",
//                         data: {
//                             _id: user._id,
//                             username: user.username,
//                             name: user.name,
//                             email: user.email,
//                             contact: user.contact
//                         }
//                     }, config.secret, {
//                         expiresIn: 604800 //for one week time in milliseconds
//                     })
//                     return res.json({
//                         success: true,
//                         token: "JWT " + token
//                     })
//                 } else {
//                     return res.json({
//                         success: true,
//                         message: "Wrong Password."
//                     })
//                 }
//             })
//         })
//     } else {
//         User.getUserByUsername(username, (err, user) => {
//             if (err) throw err
//             if (!user) {
//                 return res.json({
//                     success: false,
//                     message: "User not found."
//                 })
//             }

//             User.comparePassword(password, user.password, (err, isMatch) => {
//                 if (err) throw err
//                 if (isMatch) {
//                     const token = jwt.sign({
//                         type: "user",
//                         data: {
//                             _id: user._id,
//                             username: user.username,
//                             name: user.name,
//                             email: user.email,
//                             contact: user.contact
//                         }
//                     }, config.secret, {
//                         expiresIn: 604800 //for one week time in milliseconds
//                     })
//                     return res.json({
//                         success: true,
//                         token: "JWT " + token
//                     })
//                 } else {
//                     return res.json({
//                         success: true,
//                         message: "Wrong Password."
//                     })
//                 }
//             })
//         })
//     }

// })



/**
 * Get Authenticated user profile
 */

// router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
//     console.log(req.user)
//     return res.json(
//         req.user
//     )
// })


module.exports = router