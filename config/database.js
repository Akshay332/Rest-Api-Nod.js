module.exports = {
    // database: 'mongodb://localhost:27017/My-backend',
    database: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_ATLAS_PW}@cluster0-0koir.mongodb.net/${process.env.MONGO_DEFAULT_DATABSE}?retryWrites=true&w=majority`
}