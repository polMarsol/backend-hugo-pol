const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const usersModel = require('../models/users')

usersRouter.post('/', async (request, response) => {
    const { name, username, passwordHash, email, role } = request.body

    const saltRounds = 10
    const passwordHash2 = await bcrypt.hash(passwordHash, saltRounds)

    const user = {
        username: username, name: name, passwordHash: passwordHash2, email: email, role: role
    }

    const savedUser = await usersModel.createUser(user)
    response.status(201).json(savedUser)
})

module.exports = usersRouter