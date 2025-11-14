const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const { dbConnect } = require('./config/db')
const { authRouter } = require('./routes/auth.route')
const { postRouter } = require('./routes/post.route')
const { adminRouter } = require('./routes/admin.route')




app.use(express.json())
app.use(cors())


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/')
app.use('/api/v1/categories', )


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