const buildException = (code, message) => {
    return {
        status: code,
        message: message
    }
}

module.exports = { buildException }