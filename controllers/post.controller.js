const { PostsModel } = require('../models/posts.model')
const { postSchema } = require('../utils/validation')
const { getPaginationParams } = require('../utils/pagination')

const createPost = async (req, res) => {
    const parseData = postSchema.safeParse(req.body)

    if (!parseData.success) {
        return res.status(400).json({
            message: "invalid fields",
            error: parseData.error
        })
    }

    const { title, content, categoryId } = parseData.data
    const userid = req.userid

    try {
        const slug = title.toLowerCase().replace(/\s+/g, '-')

        const postExist = await PostsModel.findOne({
            slug: slug
        })

        if (postExist) {
            return res.status(409).json({
                message: "post slug already exists"
            })
        }

        await PostsModel.create({
            title: title,
            slug: slug,
            content: content,
            author: userid,
            category: categoryId,
            status: "pending"
        })

        res.status(201).json({
            message: "post created successfully (pending approval)"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const getAllPublishedPosts = async (req, res) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query)

        const posts = await PostsModel.find({
            status: "approved"
        }).populate('author').populate('category').skip(skip).limit(limit)

        const total = await PostsModel.countDocuments({
            status: "approved"
        })

        res.status(200).json({
            message: "published posts",
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

const getPostById = async (req, res) => {
    const postId = req.params.id

    try {
        const post = await PostsModel.findOne({
            _id: postId,
            status: "approved"
        }).populate('author').populate('category')

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        res.status(200).json({
            message: "post details",
            post: post
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const updatePost = async (req, res) => {
    const postId = req.params.id
    const userid = req.userid
    const { title, content, categoryId } = req.body

    try {
        const post = await PostsModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        if (post.author.toString() !== userid) {
            return res.status(403).json({
                message: "you can only edit your own posts"
            })
        }

        if (post.status !== "pending") {
            return res.status(400).json({
                message: "you can only edit pending posts"
            })
        }

        const slug = title.toLowerCase().replace(/\s+/g, '-')

        await PostsModel.findByIdAndUpdate(postId, {
            title: title,
            slug: slug,
            content: content,
            category: categoryId
        })

        res.status(200).json({
            message: "post updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const deletePost = async (req, res) => {
    const postId = req.params.id
    const userid = req.userid

    try {
        const post = await PostsModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        if (post.author.toString() !== userid) {
            return res.status(403).json({
                message: "you can only delete your own posts"
            })
        }

        if (post.status !== "pending") {
            return res.status(400).json({
                message: "you can only delete pending posts"
            })
        }

        await PostsModel.findByIdAndDelete(postId)

        res.status(200).json({
            message: "post deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

module.exports = {
    createPost: createPost,
    getAllPublishedPosts: getAllPublishedPosts,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost: deletePost
}