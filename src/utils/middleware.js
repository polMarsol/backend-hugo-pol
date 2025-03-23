const logger = require("../utils/logger")

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandlerUser = (error, request, response, next) => {
    if (error.code == "SQLITE_CONSTRAINT"
    && error.message.includes("UNIQUE constraint failed: users.username"))
    {
    response.status(400).json({ error: "expected `username` to be unique" })
    } else if (error.code == "SQLITE_CONSTRAINT"
    && error.message.includes("UNIQUE constraint failed: users.email"))
    {
    response.status(400).json({ error: "expected `email` to be unique" })
    } else {
    response.status(500).json({ error: error.message })
    }
    next(error)
}

const errorHandlerProduct = (error, request, response, next) => {
    if (error.code == "SQLITE_CONSTRAINT"
    && error.message.includes("NOT NULL constraint failed: products.shopId"))
    {
    response.status(400).json({ error: "Datos de entrada inválidos" })
    } else {
    response.status(500).json({ error: error.message })
    }
    next(error)
}

const authenticateToken = (request, response, next) => {
    const authHeader = request.get("authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

    if (!token) {
        return response.status(401).json({ error: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return response.status(401).json({ error: "Token invalid" });
        }
        request.user = decodedToken;
        next();
    });
};



module.exports = { requestLogger, unknownEndpoint, errorHandlerUser, errorHandlerProduct, authenticateToken }