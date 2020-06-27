const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')



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

//Set the static folder
app.use('/uploads', express.static('uploads'))

//BodyParser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}))

//Bring in the admin routes 
const admin = require('./routes/admin')
app.use('/api/admin', admin)

//Bring in the hotels routes 
const product = require('./routes/product')
app.use('/api/products', product)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})