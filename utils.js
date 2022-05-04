const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const JWT_SECRET = "my-secret-key"

module.exports.hashPassword = (password) => {
    const hashValue = bcrypt.hashSync(password, 8)
    return hashValue
}

module.exports.comparePassword = (password, hash) => {
    const correct = bcrypt.compareSync(password, hash)
    return correct
}

module.exports.getJWTToken = (account) => {
    const userData = {userId: account.id, username: account.username}
    const accesToken = jwt.sign(userData, JWT_SECRET)
    return accesToken
}

module.exports.verifyJWT = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

module.exports.decodeJWT = (token) => {
    return jwt.decode(token, JWT_SECRET)
}