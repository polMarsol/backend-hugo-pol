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

    console.log('Id generat', user.id)

    const userForToken = {
        id: user.id,
        username: user.username,
        role: user.role
    };


    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '5m' });
    response
        .status(200)
        .send({ token, id: user.id, username: user.username, name: user.name, role: user.role });
});

module.exports = loginRouter;
