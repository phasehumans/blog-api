const {Router} = require('express')
const adminRouter = Router()

adminRouter.get('/posts')
adminRouter.put('/posts/:id/approve')
adminRouter.put('/posts/:id/reject')


module.exports = {
    adminRouter : adminRouter
}