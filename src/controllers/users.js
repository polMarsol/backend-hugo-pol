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
    const { name, username, email, role, passwordActual, newPassword } = request.body;

    const user = await usersModel.getUserById(request.params.id);
    
    if (!user) {
        return response.status(400).json({ error: "Invalid credentials" });
    }

    if ((email || newPassword) && !passwordActual) {
        return response.status(400).json({ error: "Invalid credentials" });
    }

    if (passwordActual) {
        const passwordCorrect = await bcrypt.compare(passwordActual, user.passwordHash);
        if (!passwordCorrect) {
            return response.status(400).json({ error: "Invalid credentials" });
        }
    }

    const updatedUser = { name, username, email, role };
    if (newPassword) {
        const saltRounds = 10;
        updatedUser.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    }

    await usersModel.updateUser(request.params.id, updatedUser);
    response.status(200).json({ message: "User updated successfully" });
});

usersRouter.delete('/:id', async (request, response) => {
    const user = await usersModel.getUserById(request.params.id);

    if (!user) {
        return response.status(404).json({ error: "User not found" });
    }

    await usersModel.deleteUserById(request.params.id);
    response.status(204).end();
});


module.exports = usersRouter