const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


function authMiddleware (req, res, next){
    const token = req.headers.token
    // console.log(token)

    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET)

        // console.log(decodeData._id)
        // console.log(decodeData.role)
    
        if(decodeData){
            req.userid = decodeData._id
            req.role = decodeData.role
            next()
        }else{
            return res.status(403).json({
                message : "you are not singed in"
            })
        }

    } catch (error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }

}

module.exports = {
    authMiddleware : authMiddleware
}