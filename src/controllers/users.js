const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const usersModel = require('../models/users')


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Agrega un usuario a la base de datos con un hash de contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - name
 *               - passwordHash
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               name:
 *                 type: string
 *                 example: John Doe
 *               passwordHash:
 *                 type: string
 *                 example: mysecretpassword
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 role:
 *                   type: string
 *                   example: user
 */


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