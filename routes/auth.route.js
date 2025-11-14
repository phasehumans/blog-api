const {Router} = require('express')
const authRouter = Router()

authRouter.post('/register')
authRouter.post('/register/admin')
authRouter.post('/login')
authRouter.post('/apikey')
authRouter.get('/profile')


module.exports = {
    authRouter : authRouter
}