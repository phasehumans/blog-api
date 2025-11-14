const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const { dbConnect } = require('./utils/db')




app.use(express.json())
app.use(cors())


// app.use('/api/v1/auth', )


const PORT = process.env.PORT
dbConnect()
    .then(() => {
        app.listen(PORT)
        console.log(`server is listening on PORT ${PORT}`)
    })
    .catch((error) => {
        console.log('server connection error', error)
        process.exit(1)
    })