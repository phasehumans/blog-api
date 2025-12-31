const { email } = require("zod")
const { UserModel } = require("../models/users.model")
const {ApiKeyModel} = require('../models/apikeys.model')
const { registerSchema, loginSchema } = require("../utils/validation")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { generateAPI } = require("../utils/apikey")
dotenv.config()


const registerUser = async (req, res) => {
    const parseData = registerSchema.safeParse(req.body)

    if(!parseData.success){
        return res.status(400).json({
          message: "invalid fields",
          // error : parseData.error
          errors: parseData.error.flatten().fieldErrors,
        });
    }

    const {firstName, lastName, email, password, avatar} = parseData.data

    const userExist = await UserModel.findOne({
        email : email
    })

    if(userExist){
        return res.status(409).json({
            message : "email already exists"
        })
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10)
        await UserModel.create({
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : hashPassword,
            avatar : avatar,
            role : "user"
        })

        res.status(201).json({
            message : "sign-up completed"
        })


    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }

    
}

const registerAdmin = async (req, res) => {
    const parseData = registerSchema.safeParse(req.body)

    if(!parseData.success){
        return res.status(400).json({
          message: "invalid fields",
          // error : parseData.error
          errors: parseData.error.flatten().fieldErrors,
        });
    }

    const {firstName, lastName, email, password, avatar} = parseData.data

    const adminExist = await UserModel.findOne({
        email : email,
        // role : "admin" > diff email for USER && ADMIN
    })

    if(adminExist){
        return res.status(409).json({
            message : "email already exists"
        })
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10)
        await UserModel.create({
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : hashPassword,
            avatar : avatar,
            role : "admin"
        })

        res.status(201).json({
            message : "sign-up completed (admin)"
        })
    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}

const login = async (req, res) => {
    const parseData = loginSchema.safeParse(req.body)

    if(!parseData.success){
        return res.status(400).json({
            message : "invalid fields",
            error : parseData.error
        })
    }

    const { email, password } = parseData.data

    const user = await UserModel.findOne({
        email : email
    })

    if(!user){
        return res.status(404).json({
            message : "user doesnot found"
        })
    }

    try {
        const passwordCompare = await bcrypt.compare(password, user.password)
    
        if(passwordCompare){
            const token = jwt.sign({
                _id : user._id,
                role : user.role
            }, process.env.JWT_SECRET)
    
            res.status(200).json({
                message : "login-in successfull",
                token : token
            })
        } else {
            return res.status(401).json({
                message : "invalid password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message : "server error",
            error : error.message
        })
    }
}

const getProfile = async (req, res ) => {
    try {
        const userid = req.userid
        const role = req.role
    
        const profileData = await UserModel.findOne({
            _id : userid,
            role : role
        })
    
        if(!profileData){
            return res.status(404).json({
                message : "user not found"
            })
        }
    
        res.status(200).json({
            message : "user details",
            details : profileData
        })
    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}

const generateApiKey = async (req, res) => {
    const userid = req.userid

    // console.log(userid)

    const rawkey = generateAPI()
    const hashedKey = require('crypto').createHash("sha256").update(rawkey).digest("hex");

    try {
        await ApiKeyModel.create({
            createdby : userid,
            key : hashedKey,
            active : true
        })
    
        res.status(201).json({
            message : "api key is created",
            key : rawkey
        })
    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}

const changePassword = async (req, res) => {
    const userid = req.userid
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message : "all fields are required"
        })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message : "new passwords do not match"
        })
    }

    if (newPassword.length < 6 || newPassword.length > 20) {
        return res.status(400).json({
            message : "password must be between 6-20 characters"
        })
    }

    try {
        const user = await UserModel.findById(userid)

        if (!user) {
            return res.status(404).json({
                message : "user not found"
            })
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            return res.status(401).json({
                message : "old password is incorrect"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await UserModel.findByIdAndUpdate(userid, {
            password : hashedPassword
        })

        res.status(200).json({
            message : "password changed successfully"
        })
    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}

const revokeApiKey = async (req, res) => {
    const keyId = req.params.id
    const userid = req.userid

    // console.log(keyId)
    // console.log(userid)

    try {
        const apiKey = await ApiKeyModel.findById(keyId)

        if (!apiKey) {
            return res.status(404).json({
                message : "api key not found"
            })
        }

        if (apiKey.createdby.toString() !== userid) {
            return res.status(403).json({
                message : "you can only revoke your own api keys"
            })
        }

        await ApiKeyModel.findByIdAndUpdate(keyId, {
            active : false
        })

        res.status(200).json({
            message : "api key revoked successfully"
        })
    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}

module.exports = {
    registerUser : registerUser,
    registerAdmin : registerAdmin,
    login : login,
    getProfile : getProfile,
    generateApiKey : generateApiKey,
    changePassword : changePassword,
    revokeApiKey : revokeApiKey
}