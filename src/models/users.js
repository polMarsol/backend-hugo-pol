const db = require("../utils/db")

const createUser = user => {
    return new Promise((resolve, reject) => {
        const {name, username, passwordHash, email, role } = user

        const sql = "INSERT INTO users (name, username, passwordHash, email, role) VALUES (?, ?, ?, ?, ?)"

        db.run(sql, [name, username, passwordHash, email, role], function (err) {
            err
                ? reject(err)
                : resolve({
                    id: this.lastID,
                    name: name,
                    username: username,
                    passwordHash: passwordHash,
                    email: email,
                    role: role
                })
        })
    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", [], (err, rows) => {
            err ? reject(err) : resolve(rows)
        })
    })
}

const getUserByUsername = username => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users where users.username = ?"
        db.get(sql, [username], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}

module.exports = { createUser, getAllUsers, getUserByUsername }