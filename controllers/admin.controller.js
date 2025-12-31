const { PostsModel } = require('../models/posts.model')
const { getPaginationParams } = require('../utils/pagination')

const getAllPendingPosts = async (req, res) => {
    // console.log(req.role)
    try {
        const { page, limit, skip } = getPaginationParams(req.query)

        const posts = await PostsModel.find({
          status: "pending",
        }).skip(skip).limit(limit);
        // .populate('author').populate('category').skip(skip).limit(limit)

        // console.log(posts)

        const total = await PostsModel.countDocuments({
            status: "pending"
        })

        res.status(200).json({
            message: "pending posts",
            pagination: {
                page: page,
                limit: limit,
                total: total,
                pages: Math.ceil(total / limit)
            },
            posts: posts
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const approvePost = async (req, res) => {
    const postId = req.params.id

    try {
        const post = await PostsModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        if (post.status !== "pending") {
            return res.status(400).json({
                message: "only pending posts can be approved"
            })
        }

        await PostsModel.findByIdAndUpdate(postId, {
            status: "approved"
        })

        res.status(200).json({
            message: "post approved successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const rejectPost = async (req, res) => {
    const postId = req.params.id
    const { comment } = req.body

    if(!comment){
        return res.status(400).json({
            message : "comment is required"
        })
    }

    try {
        const post = await PostsModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        if (post.status !== "pending") {
            return res.status(400).json({
                message: "only pending posts can be rejected"
            })
        }

        await PostsModel.findByIdAndUpdate(postId, {
            status: "rejected",
            rejectionComment: comment || null
        })

        res.status(200).json({
            message: "post rejected successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

module.exports = {
    getAllPendingPosts: getAllPendingPosts,
    approvePost: approvePost,
    rejectPost: rejectPost
}
