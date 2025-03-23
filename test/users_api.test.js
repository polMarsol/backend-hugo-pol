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
        db.serialize(() => {
            db.run('DELETE FROM users')
        })
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

    test('fetching a user by ID succeeds', async () => {
        const usersAtStart = await usersModel.getAllUsers();
        const userToRetrieve = usersAtStart[0];

        const result = await api
            .get(`/api/users/${userToRetrieve.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.id, userToRetrieve.id);
        assert.strictEqual(result.body.username, userToRetrieve.username);
        assert.strictEqual(result.body.email, userToRetrieve.email);
    });

    test('updating a user succeeds with valid data', async () => {
        const usersAtStart = await usersModel.getAllUsers();
        const userToUpdate = usersAtStart[0];

        const updatedData = {
            name: "Updated Name",
            username: "updatedUsername",
            email: "updated@example.com",
            role: "admin",
            passwordActual: "secret",
            newPassword: "newSecret123"
        };

        const result = await api
            .put(`/api/users/${userToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.message, "User updated successfully");

        const updatedUser = await usersModel.getUserById(userToUpdate.id);
        assert.strictEqual(updatedUser.name, updatedData.name);
        assert.strictEqual(updatedUser.username, updatedData.username);
        assert.strictEqual(updatedUser.email, updatedData.email);
    });

    test('deleting a user succeeds', async () => {
        const usersAtStart = await usersModel.getAllUsers();
        const userToDelete = usersAtStart[0];

        await api
            .delete(`/api/users/${userToDelete.id}`)
            .expect(204);

        const usersAtEnd = await usersModel.getAllUsers();

        assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1);
        assert(!usersAtEnd.some(user => user.id === userToDelete.id));
    });

    test('fetching all users returns correct data', async () => {
        const usersAtStart = await usersModel.getAllUsers();

        const result = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.length, usersAtStart.length);
        assert.deepStrictEqual(result.body, usersAtStart);
    });

    test('fetching a non-existing user returns 404', async () => {
        const nonExistentId = 99999;

        const result = await api
            .get(`/api/users/${nonExistentId}`)
            .expect(404)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.error, "User not found");
    });

    test('updating a user fails if current password is incorrect', async () => {
        const usersAtStart = await usersModel.getAllUsers();
        const userToUpdate = usersAtStart[0];

        const wrongPasswordData = {
            name: "New Name",
            username: "newUsername",
            email: "new@example.com",
            role: "admin",
            passwordActual: "wrongPassword",
            newPassword: "newSecret123"
        };

        const result = await api
            .put(`/api/users/${userToUpdate.id}`)
            .send(wrongPasswordData)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.error, "Invalid credentials");

        const userAfterUpdate = await usersModel.getUserById(userToUpdate.id);
        assert.strictEqual(userAfterUpdate.username, userToUpdate.username);
    });

    test('deleting a non-existing user returns 404', async () => {
        const nonExistentId = 99999;

        const result = await api
            .delete(`/api/users/${nonExistentId}`)
            .expect(404)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.error, "User not found");
    });

})