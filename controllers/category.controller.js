const { CategoryModel } = require('../models/categories.model')
const { getPaginationParams } = require('../utils/pagination')

const createCategory = async (req, res) => {
    const { name } = req.body

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "category name is required"
        })
    }

    try {
        const categoryExist = await CategoryModel.findOne({
            name: name
        })

        if (categoryExist) {
            return res.status(409).json({
                message: "category already exists"
            })
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-')

        await CategoryModel.create({
            name: name,
            slug: slug
        })

        res.status(201).json({
            message: "category created successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query)

        const categories = await CategoryModel.find({}).skip(skip).limit(limit)

        const total = await CategoryModel.countDocuments({})

        res.status(200).json({
            message: "all categories",
            pagination: {
                page: page,
                limit: limit,
                total: total,
                pages: Math.ceil(total / limit)
            },
            categories: categories
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const updateCategory = async (req, res) => {
    const categoryId = req.params.id
    const { name } = req.body

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "category name is required"
        })
    }

    try {
        const category = await CategoryModel.findById(categoryId)

        if (!category) {
            return res.status(404).json({
                message: "category not found"
            })
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-')

        await CategoryModel.findByIdAndUpdate(categoryId, {
            name: name,
            slug: slug
        })

        res.status(200).json({
            message: "category updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    const categoryId = req.params.id

    try {
        const category = await CategoryModel.findById(categoryId)

        if (!category) {
            return res.status(404).json({
                message: "category not found"
            })
        }

        await CategoryModel.findByIdAndDelete(categoryId)

        res.status(200).json({
            message: "category deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

module.exports = {
    createCategory: createCategory,
    getAllCategories: getAllCategories,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
}
