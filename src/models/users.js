const { reject } = require("bcrypt/promises")
const db = require("../utils/db")

const createUser = user => {
    return new Promise((resolve, reject) => {
        const {name, username, password, email, role } = user
        const sql = "INSERT INTO users (name, username, password, email, role) VALUES (?, ?, ?, ?, ?)"

        db.run(sql, [name, username, password, email, role], function (err) {
            err
                ? reject(err)
                : resolve({
                    id: this.lastID,
                    name: name,
                    username: username,
                    email: email,
                    role: role
                })
        })
    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT name, username, email, role FROM users", [], (err, rows) => {
            err ? reject(err) : resolve(rows)
        })
    })
}

const getUserByUsername = username => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT name, username, email, role FROM users where users.username = ?"
        db.get(sql, [username], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}


const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT name, username, email, role FROM users where users.id = ?"
        db.get(sql, [id], (err, row) => {
            err ? reject(err) : resolve(row)
        })
    })
}
 

const updateUser = (id, user) => {
    return new Promise((resolve, reject) => {
        const {name, username, password, email, role } = user
        const sql = "UPDATE users SET name = ?, username = ?, password = ?, email = ?, role = ? WHERE id = ?"
        
        db.run(sql, [name, username, password, email, role, id], function (err) {
            err ? reject(err) : resolve({
                id: id,
                name: name,
                username: username,
                email: email,
                role: role
            })
        })
    })
}


const deleteUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM users WHERE id = ?"
        db.run(sql, [id], function (err) {
            err ? reject(err) : resolve({})
        })
    })
}


module.exports = { createUser, getAllUsers, getUserByUsername, getUserById, updateUser, deleteUserById}