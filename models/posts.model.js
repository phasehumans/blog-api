const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
      },
    
      slug: {
        type: String,
        required: true,
        unique: true
      },
    
      content: {
        type: String,
        required: true
      },
    
      author: {
        type: ObjectId,
        ref: 'User',
        required: true
      },
    
      category: {
        type: ObjectId,
        ref: 'Category',
        required: true
      },
    
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
    
      rejectionComment: {
        type: String,
        default: null
      }
}, {
    timestamps : true
})

const PostsModel = mongoose.model('post', postSchema)

module.exports = {
    PostsModel : PostsModel
}