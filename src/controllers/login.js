const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const userModel = require('../models/users');


loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;
    const user = await userModel.getUserByUsername(username);
    console.log('Usuario encontrado:', user);
    const passwordCorrect = user && user.password
        ? await bcrypt.compare(password, user.password)
        : false;

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }

    const userForToken = {
        username: user.username,
        id: user.id,
        role: user.role
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });
    response
        .status(200)
        .send({ token, username: user.username, name: user.name, role: user.role });
});

module.exports = loginRouter;
