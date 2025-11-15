const { Router } = require('express')
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/category.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

const categoryRouter = Router()

const roleCheckAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({
            message: "only admins can access this resource"
        })
    }
    next()
}

categoryRouter.post('/', authMiddleware, roleCheckAdmin, createCategory)
categoryRouter.get('/', getAllCategories)
categoryRouter.put('/:id', authMiddleware, roleCheckAdmin, updateCategory)
categoryRouter.delete('/:id', authMiddleware, roleCheckAdmin, deleteCategory)

module.exports = {
    categoryRouter: categoryRouter
}