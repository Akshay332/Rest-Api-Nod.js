const express = require('express')
const router = express.Router()
const Contactus = require('../model/contactus')

router.post('/submit', async(req, res) => {
    const contact = new Contactus(req.body)
    try {

        res.status(201).send(contact)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router