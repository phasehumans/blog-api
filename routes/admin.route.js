const { Router } = require('express')
const { getAllPendingPosts, approvePost, rejectPost } = require('../controllers/admin.controller.js')
const { authMiddleware } = require('../middlewares/auth.middleware.js')

const adminRouter = Router()

const roleCheckAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({
            message: "only admins can access this resource"
        })
    }
    next()
}

adminRouter.get('/posts', authMiddleware, roleCheckAdmin, getAllPendingPosts)
adminRouter.put('/posts/:id/approve', authMiddleware, roleCheckAdmin, approvePost)
adminRouter.put('/posts/:id/reject', authMiddleware, roleCheckAdmin, rejectPost)

module.exports = {
    adminRouter: adminRouter
}