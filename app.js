const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
var path = require("path");



//Bring in the database object
const config = require('./config/database')

//Mongodb Config
mongoose.set('useCreateIndex', true)

//Connect with the database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully ' + config.database)
    }).catch(err => {
        console.log(err)
    })

//initialize the app
const app = express()

//defining the port
const PORT = process.env.PORT || 3000



//Defining the Middlewares
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    next()
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/index.html'));
});
//Set the static folder
app.use('/uploads', express.static('uploads'))

//BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//Bring in the admin routes 
const admin = require('./routes/admin')
app.use('/api/admin', admin)

const destination = require('./routes/destination')
app.use('/api/destinations', destination)

//Bring in the products routes 
const product = require('./routes/product')
app.use('/api/products', product)

const hotel = require('./routes/hotels')
app.use('/api/hotels', hotel)

const cabs = require('./routes/cabs')
app.use('/api/cabs', cabs)

const users = require('./routes/users')
app.use('/api/users', users)

const contactus = require('./routes/contactus')
app.use('/api/contactus', contactus)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})