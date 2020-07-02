const express = require('express')
const router = express.Router()
const Destination = require('../model/destination')
const adminAuth = require('../middleware/adminAuth')
const upload = require('../middleware/upload')


router.post('/create', adminAuth, upload.array('images'), async(req, res) => {
    const destination = new Destination({
        ...req.body,
        owner: req.admin._id
    })
    if (req.files) {
        let path = ''
        req.files.forEach(function(files, index, arr) {
            path = path + files.path + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        destination.images = path
    }
    try {
        await destination.save()
        res.status(201).send(destination)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/getDestination', adminAuth, async(req, res) => {
    Destination.find({}).then((destination) => {
        res.send(destination)
    }).catch((e) => {
        res.status(500).send()
    })

})


//Read hotel by id
router.get('/read/:id', adminAuth, async(req, res) => {
    const _id = req.params.id
    try {
        const destination = await Destination.findOne({ _id, owner: req.admin._id })
        if (!destination) {
            return res.status(404).send()
        }
        res.send(destination)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/update/:destID', adminAuth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['title', 'description', 'images']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const destination = await Destination.findOne({ _id: req.params.destID, owner: req.admin._id })
        if (!destination) {
            return res.status(404).send()
        }
        updates.forEach((update) => destination[update] = req.body[update])
        await destination.save()
        res.send(destination)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/delete/:id', adminAuth, async(req, res) => {

    try {
        const destination = await Destination.findOneAndDelete({ _id: req.params.id, owner: req.admin._id })
        if (!destination) {
            return res.status(404).send()
        }

        res.send(hotel)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router