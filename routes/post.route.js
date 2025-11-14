const {Router} = require('express')
const postRouter = Router()

postRouter.post('/')
postRouter.get('/')
postRouter.get('/:id')
postRouter.put('/:id')
postRouter.delete('/:id')

module.exports = {
    postRouter : postRouter
}