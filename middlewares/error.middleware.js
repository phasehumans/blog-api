const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message)

    const statusCode = err.statusCode || 500
    const message = err.message || 'internal server error'

    res.status(statusCode).json({
        message: message,
        error: process.env.NODE_ENV === 'production' ? {} : err
    })
}

module.exports = {
    errorHandler: errorHandler
}
