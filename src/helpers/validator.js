const { getMessage } = require("./messages")

// para traduzir as mensagem de erros
const getValidatorError = (error, messagePath) => {
    if (!error) return null

    const errorMessages = {}
    error.details.map((details) => {
        const message = details.message
        const type = details.type
        const key = details.context.key

        const path = `${messagePath}.${key}.${type}`

        const customMessage = getMessage(path)
        if (!customMessage) {
            console.log("customMessagem not found for path", path)
        }

        errorMessages[key] = getMessage(path) || message
    })

    return errorMessages
}

module.exports = { getValidatorError, getMessage }