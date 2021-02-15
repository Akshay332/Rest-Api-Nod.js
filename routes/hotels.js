const express = require('express')
const router = express.Router()
const Hotels = require('../model/hotels')
const adminAuth = require('../middleware/adminAuth')
const upload = require('../middleware/upload')


router.post('/create',  async(req, res) => {
    const hotels = new Hotels({
        ...req.body,
       
    })
   
    try {
        await hotels.save()
        res.status(201).send(hotels)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/getHotels', adminAuth, async(req, res) => {
    Hotels.find({}).then((hotels) => {
        res.send(hotels)
    }).catch((e) => {
        res.status(500).send()
    })

})


//Read hotel by id
router.get('/read/:id', adminAuth, async(req, res) => {
    const _id = req.params.id
    try {
        const hotels = await Hotels.findOne({ _id, owner: req.admin._id })
        if (!hotels) {
            return res.status(404).send()
        }
        res.send(hotels)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/update/:hotelID', adminAuth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['title', 'description', 'images']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const hotel = await Hotels.findOne({ _id: req.params.hotelID, owner: req.admin._id })
        if (!hotel) {
            return res.status(404).send()
        }
        updates.forEach((update) => hotel[update] = req.body[update])
        await hotel.save()
        res.send(hotel)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Delete hotel by admin by id
router.delete('/delete/:id', adminAuth, async(req, res) => {

    try {
        const hotel = await Hotels.findOneAndDelete({ _id: req.params.id, owner: req.admin._id })
        if (!hotel) {
            return res.status(404).send()
        }

        res.send(hotel)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router