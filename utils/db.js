const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongodb connected')
    } catch (error) {
        console.log('error connecting mongodb', error)
        process.exit(1)
    }
}


module.exports = {
    dbConnect : dbConnect
}