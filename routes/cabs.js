const express = require('express')
const router = express.Router()
const Cabs = require('../model/cabs')
const adminAuth = require('../middleware/adminAuth')
const upload = require('../middleware/upload')


router.post('/create', adminAuth, upload.array('images'), async(req, res) => {
    const cabs = new Cabs({
        ...req.body,
        owner: req.admin._id
    })
    if (req.files) {
        let path = ''
        req.files.forEach(function(files, index, arr) {
            path = path + files.path + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        cabs.images = path
    }
    try {
        await cabs.save()
        res.status(201).send(cabs)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/getCabs', adminAuth, async(req, res) => {
    Cabs.find({}).then((cabs) => {
        res.send(cabs)
    }).catch((e) => {
        res.status(500).send()
    })

})


//Read hotel by id
router.get('/read/:id', adminAuth, async(req, res) => {
    const _id = req.params.id
    try {
        const cabs = await Cabs.findOne({ _id, owner: req.admin._id })
        if (!cabs) {
            return res.status(404).send()
        }
        res.send(cabs)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/updateCabs/:id', adminAuth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'price']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const cabs = await Cabs.findOne({ _id: req.params.id, owner: req.admin._id })

        if (!cabs) {
            return res.status(404).send()
        }

        updates.forEach((update) => cabs[update] = req.body[update])
        await cabs.save()
        res.send(cabs)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.patch('/update/:cabsId', adminAuth, async(req, res) => {
//     try {
//         const updateCabs = await Cabs.updateOne({ _id: req.params.cabsId }, { $set: { title: req.body.title } }

//         )
//         res.json(updateCabs)
//     } catch (err) {
//         res.json({ message: err })
//     }
// })

router.delete('/delete/:id', adminAuth, async(req, res) => {

    try {
        const cabs = await Cabs.findOneAndDelete({ _id: req.params.id, owner: req.admin._id })
        if (!cabs) {
            return res.status(404).send()
        }

        res.send(cabs)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router