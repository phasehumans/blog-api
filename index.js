const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET', 'PORT']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '))
    process.exit(1)
}

const { dbConnect } = require('./config/db.js')
const { authRouter } = require('./routes/auth.route.js')
const { postRouter } = require('./routes/post.route.js')
const { adminRouter } = require('./routes/admin.route.js')
const { categoryRouter } = require('./routes/category.route.js')
const { sanitizeMiddleware } = require('./middlewares/sanitize.middleware.js')


app.use(express.json())
app.use(cors())
app.use(sanitizeMiddleware)


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/categories', categoryRouter)


const PORT = process.env.PORT || 8000
dbConnect()
    .then(() => {
        app.listen(PORT)
        console.log(`server is listening on PORT ${PORT}`)
    })
    .catch((error) => {
        console.log('server connection error', error)
        process.exit(1)
    })