const bcrypt = require("bcrypt")
const assert = require('node:assert')
const { test, describe, beforeEach } = require('node:test')
const supertest = require('supertest')

const app = require("../src/app")
const { usersModel } = require("../src/models")
const db = require('../src/utils/db')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        // Clear the users table
        db.serialize(() => {
            db.run('DELETE FROM users')
        })
        // Create the root user
        const adminUser = {
            name: "admin2",
            username: "admin",
            passwordHash: await bcrypt.hash("secret", 10),
            email: "admin2@gmail.com",
            role: "admin"
        }
        await usersModel.createUser(adminUser)
    })

    test('creation succeeds with a fresh username', async () => {
        const newUser = {
            name: "Pol",
            username: "pol",
            passwordHash: await bcrypt.hash("secret", 10),
            email: "pol@gmail.com",
            role: "shopper"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const allUsers = await usersModel.getAllUsers()
        const usernames = allUsers.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails if username already taken', async () => {
        const usersAtStart = await usersModel.getAllUsers()
        const newUser = {
            name: "Carlos López",
            username: "admin",
            passwordHash: await bcrypt.hash("admin1234", 10),
            email: "carlos@example.com",
            role: "admin"
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(result.body.error.includes('expected `username` to be unique'))
        const usersAtEnd = await usersModel.getAllUsers()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})