require("dotenv").config()
const jwt = require("jsonwebtoken")

const tokenPrivateKey = process.env.JWT_TOKEN_PRIVATE_KEY
const refreshtokenPrivateKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY

const options = { expiresIn: "30 minutes" }
const RefreshOptions = { expiresIn: "30 days" }

const generateJwt = (payload) => {
    return jwt.sign(payload, tokenPrivateKey, options)
}

const generateRefreshJwt = (payload) => {
    return jwt.sign(payload, refreshtokenPrivateKey, RefreshOptions)
}

const verifyJwt = (token) => {
    return jwt.verify(token, tokenPrivateKey)
}

const verifyRefreshJwt = (token) => {
    return jwt.verify(token, refreshtokenPrivateKey)
}

const getTokenFromHeaders = (headers) => {
    const token = headers["authorization"]
    return token

}


module.exports = { generateJwt, generateRefreshJwt, verifyJwt, verifyRefreshJwt, getTokenFromHeaders }