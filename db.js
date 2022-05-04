const sqlite = require("sqlite3")
const db = new sqlite.Database("database.db")

db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY,
        name TEXT,
        username TEXT,
        motto TEXT,
        hashedPassword TEXT,
        CONSTRAINT uniqeUsername UNIQUE(username)
    )
`)
db.run(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY,
        make TEXT,
        model TEXT
    )
`)



module.exports.registerUser = (name, username, motto, hashedPassword, callback) => {
    const query = `
    INSERT INTO accounts
        (name, username, motto, hashedPassword)
    VALUES
        (?, ?, ?, ?)
    `

    const values = [
        name,
        username,
        motto,
        hashedPassword
    ]

    db.run(query, values, callback)
}
module.exports.registerCar = (make, model, callback) => {
    const query = `
    INSERT INTO cars
        (make, model)
    VALUES
        (?, ?)
    `

    const values = [
        make,
        model
    ]

    db.run(query, values, callback)
}

exports.getAccountByUsername = function(username, callback) {
    const query = `
        SELECT * FROM accounts WHERE username = ?
    `
    
    const values = [username]

    db.get(query, values, callback)
}

exports.getCars = function(callback) {
    const query = `
        SELECT * FROM cars
    `

    db.all(query, callback)
}
exports.getUsers = function(callback) {
    const query = `
        SELECT * FROM accounts
    `

    db.all(query, callback)
}

