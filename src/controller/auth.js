const express = require('express')
const { Account } = require("../models")
const bcrypt = require('bcrypt')
const router = express.Router()
const { accountSignUp, accountSignIn } = require("../validators/account")
const { getMessage } = require("../helpers/validator")
const { generateJwt, generateRefreshJwt, verifyRefreshJwt, getTokenFromHeaders } = require("../helpers/jwt")

router.post("/sign-in", accountSignIn, async (req, res) => {
    const { email, password } = req.body

    const account = await Account.findOne({ where: { email } })

    // validacao de senha
    const martch = account ? bcrypt.compareSync(password, account.password) : null
    if (!martch) return res.jsonBadRequest(null, "account.signIn.invalid")

    const token = generateJwt({ id: account.id })
    const refreshtoken = generateRefreshJwt({ id: account.id, version: account.jwtVersion })

    return res.jsonOK(account, getMessage("account.signIn.success"), { token, refreshtoken })
})

const saltRounds = 10

router.post("/sign-up", accountSignUp, async (req, res) => {

    const { email, password } = req.body

    // verificar se o email ja existe
    const account = await Account.findOne({ where: { email } })
    if (account) return res.jsonBadRequest(null, "account.signup.email_exists")

    const hash = bcrypt.hashSync(password, saltRounds)
    const newAccount = await Account.create({ email, password: hash })

    const token = generateJwt({ id: newAccount.id })
    const refreshtoken = generateRefreshJwt({ id: newAccount.id, version: newAccount.jwtVersion })

    return res.jsonOK(newAccount, getMessage("account.signup.success"), { token, refreshtoken })
})

router.post("/refresh", async (req, res) => {
    const token = getTokenFromHeaders(req.headers)

    if (!token) {
        return res.jsonUnathorized(null, "invalid token")
    }
    try {
        const decoded = verifyRefreshJwt(token)
        const account = await Account.findByPk(decoded.id)
        if (!account) return res.jsonUnathorized(null, "invalid token")

        if (decoded.version != account.jwtVersion) {
            return res.jsonUnathorized(null, "invalid token")
        }

        const meta = {
            token: generateJwt({ id: account.id })
        }

        return res.jsonOK(null, null, meta)

    } catch (error) {
        return res.jsonUnathorized(null, "invalid token")
    }

})

module.exports = router