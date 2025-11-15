const {Router} = require('express')
const { registerUser, registerAdmin, login, getProfile, generateApiKey, changePassword, revokeApiKey } = require('../controllers/auth.controller')
const authRouter = Router()
const {authMiddleware} = require('../middlewares/auth.middleware')

authRouter.post('/register', registerUser)
authRouter.post('/register/admin', registerAdmin)
authRouter.post('/login', login)
authRouter.post('/apikey', authMiddleware, generateApiKey)
authRouter.put('/apikey/:id/revoke', authMiddleware, revokeApiKey)
authRouter.get('/profile', authMiddleware, getProfile)
authRouter.put('/change-password', authMiddleware, changePassword)


module.exports = {
    authRouter : authRouter
}