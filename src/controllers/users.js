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
    response.status(201).json(savedUser);
})


usersRouter.get('/', async (request, response) => {
    const users = await usersModel.getAllUsers();
    response.json(users);
});



usersRouter.get('/:id', async (request, response) => {
    const user = await usersModel.getUserById(request.params.id);

    if (!user) {
        return response.status(404).json({ error: "User not found" });
    }

    response.json(user);
});


usersRouter.put('/:id', async (request, response) => {
    const { name, username, password, email, role } = request.body;
    const updatedUser = { name, username, email, role };

    if (password) {
        updatedUser.passwordHash = await bcrypt.hash(password, 10);
    }

    const result = await usersModel.updateUser(request.params.id, updatedUser);
    response.json(result);
});


usersRouter.delete('/:id', async (request, response) => {
    await usersModel.deleteUserById(request.params.id);
    response.status(204).end();
});


module.exports = usersRouter