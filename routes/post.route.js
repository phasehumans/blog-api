const { Router } = require('express')
const { createPost, getAllPublishedPosts, getPostById, updatePost, deletePost } = require('../controllers/post.controller.js')
const { authMiddleware } = require('../middlewares/auth.middleware.js')

const postRouter = Router()

postRouter.post('/', authMiddleware, createPost)
postRouter.get('/', getAllPublishedPosts)
postRouter.get('/:id', getPostById)
postRouter.put('/:id', authMiddleware, updatePost)
postRouter.delete('/:id', authMiddleware, deletePost)

module.exports = {
    postRouter: postRouter
}