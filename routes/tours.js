const express = require('express')
const router = express.Router()
const Tours = require('../model/tours')
const adminAuth = require('../middleware/adminAuth')
const upload = require('../middleware/upload')


router.post('/create', adminAuth, upload.array('images'), async(req, res) => {
    const tours = new Tours({
        ...req.body,
        owner: req.admin._id
    })
    if (req.files) {
        let path = ''
        req.files.forEach(function(files, index, arr) {
            path = path + files.path + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        tours.images = path
    }
    try {
        await tours.save()
        res.status(201).send(tours)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/getTours', adminAuth, async(req, res) => {
    Tours.find({}).then((tours) => {
        res.send(tours)
    }).catch((e) => {
        res.status(500).send()
    })

})

router.get('/read/:id', adminAuth, async(req, res) => {
    const _id = req.params.id
    try {
        const tours = await Tours.findOne({ _id, owner: req.admin._id })
        if (!tours) {
            return res.status(404).send()
        }
        res.send(tours)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/update/:toursID', adminAuth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['title', 'description', 'images']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const tours = await Tours.findOne({ _id: req.params.toursID, owner: req.admin._id })
        if (!tours) {
            return res.status(404).send()
        }
        updates.forEach((update) => tours[update] = req.body[update])
        await tours.save()
        res.send(tours)
    } catch (e) {
        res.status(400).send(e)
    }

})


router.delete('/delete/:id', adminAuth, async(req, res) => {

    try {
        const tours = await Tours.findOneAndDelete({ _id: req.params.id, owner: req.admin._id })
        if (!tours) {
            return res.status(404).send()
        }

        res.send(tours)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router