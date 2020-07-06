const express = require("express")
const cors = require("cors")
const app = express()
const db = require("./models/index")
const response = require("./middlewares/response")
const checkJwt = require("./middlewares/jwt")

const authController = require("./controller/auth")
const linkController = require("./controller/link")

app.use(cors())

app.use(response)
app.use(checkJwt)
app.use(express.json())
app.use(express.urlencoded({ extended:false}))

app.use("/auth", authController)
app.use("/link", linkController)

app.get("/", (req, res) => {
    return res.json("to dentro")
})

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("TD ok na porta 3001")
    })
})

