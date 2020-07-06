const { verifyJwt, getTokenFromHeaders } = require("../helpers/jwt")

const checkJwt = (req, res, next) => {

    // apelidando variavel para path
    const { url: path } = req

    const excludePaths = ["/auth/sign-in", "/auth/sign-up", "/auth/refresh"]

    const isExcluded = !!excludePaths.find((p) => p.startsWith(path))
    if (isExcluded) return next()


    const token = getTokenFromHeaders(req.headers)
    if (!token) {
        return res.jsonUnathorized(null, "invalid token")
    }

    try {
        const decoded = verifyJwt(token)
        req.accountId = decoded.id
    } catch (error) {
        return res.jsonUnathorized(null, "invalid token")
    }

}

module.exports = checkJwt