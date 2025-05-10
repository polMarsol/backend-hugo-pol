const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const usersModel = require('../models/users')
const { verifyToken, verifyRole } = require('../utils/middleware');

usersRouter.post('/', verifyToken, verifyRole(['admin']), async (request, response) => {
    const { name, username, password, email, role } = request.body;

    if (role != 'admin' && role != 'salesperson') {
        return response.status(403).json({ error: 'El administradir puede crear otros admin o salespersons únicamente' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = {
        username,
        name,
        password: passwordHash,
        email,
        role
    };

    try {
        const savedUser = await usersModel.createUser(user);
        response.status(201).json(savedUser);
    } catch (error) {
        response.status(500).json({ error: 'Error al crear el usuario' });
    }
});



usersRouter.get('/', async (request, response) => {
    const users = await usersModel.getAllUsers();
    response.json(users);
});



usersRouter.get('/:id', async (request, response) => {
    const user = await usersModel.getUserById(request.params.id);

    if (!user) {
        return response.status(404).json({ error: "Usuario no encontrado" });
    }

    response.json(user);
});


usersRouter.put('/:id', verifyToken, async (request, response) => {
    const { id } = request.params;
    const loggedInUserId = request.user.id;
    console.log('Usuario: ', await usersModel.getUserById(id));
    console.log('Usuario logueado: ', await usersModel.getUserById(loggedInUserId));
    // Solo el propio usuario puede modificar sus datos
    if (parseInt(id) !== loggedInUserId) {
        return response.status(403).json({ error: "No tienes permiso para modificar este usuario" });
    }

    const { name, username, email, role, passwordActual, newPassword } = request.body;


    const user = await usersModel.getUserById(id); // importante: usa getUserById, no por username
    if (!user) {
        return response.status(400).json({ error: "Credenciales inválidas" });
    }


    // Si quiere cambiar email o contraseña, debe proporcionar contraseña actual
    if ((email || newPassword) && !passwordActual) {
        return response.status(400).json({ error: "Credenciales inválidas" });
    }

    console.log("contrasenya: ", user.password)

    if (passwordActual) {
        const passwordCorrect = await bcrypt.compare(passwordActual, user.password);
        if (!passwordCorrect) {
            return response.status(400).json({ error: "Credenciales inválidas" });
        }
    }

    const updatedUser = { name, username, newPassword, email, role };


    if (newPassword) {
        const saltRounds = 10;
        updatedUser.newPassword = await bcrypt.hash(newPassword, saltRounds);
    }


    try {
        console.log("id", id)
        console.log("uptadetafew ", updatedUser)
        await usersModel.updateUser(id, updatedUser);
        response.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        response.status(500).json({ error: "Error al actualizar el usuario" });
    }
});


usersRouter.delete('/:id', async (request, response) => {
    const user = await usersModel.getUserById(request.params.id);

    if (!user) {
        return response.status(404).json({ error: "Usuario no encontrado" });
    }

    await usersModel.deleteUserById(request.params.id);
    response.status(204).end();
});


module.exports = usersRouter