const sanitizeInput = (data) => {
    if (typeof data === 'string') {
        return data.trim().replace(/[<>]/g, '')
    }
    if (typeof data === 'object' && data !== null) {
        return Object.keys(data).reduce((acc, key) => {
            acc[key] = sanitizeInput(data[key])
            return acc
        }, Array.isArray(data) ? [] : {})
    }
    return data
}

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeInput(req.body)
    }
    next()
}

module.exports = {
    sanitizeMiddleware: sanitizeMiddleware
}
