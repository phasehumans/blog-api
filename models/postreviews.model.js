const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Types

const postReviewSchema = new Schema({
    post: {
        type: ObjectId,
        ref: 'Post',
        required: true
      },
    
      reviewedBy: {
        type: ObjectId,
        ref: 'User',
        required: true
      },
    
      action: {
        type: String,
        enum: ['approved', 'rejected'],
        required: true
      },
    
      comment: {
        type: String,
        default: null
      }
}, {
    timestamps : true
})

const PostReviewModel = mongoose.model('postreview', postReviewSchema)

module.exports = {
    PostReviewModel : PostReviewModel
}