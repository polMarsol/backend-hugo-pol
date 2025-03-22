const express = require("express")
require("express-async-errors")
const { initDb } = require("./models")
const usersRouter = require("./controllers/users")
const middleware = require("./utils/middleware")
const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const app = express()
initDb()

app.use(express.json())
app.use(middleware.requestLogger)

// Documentación con Swagger
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "Documentación automática con Swagger en Express.js",
      },
    },
    apis: ["src/controllers/*.js"], // Arxius on estaran comentades les rutes
  };

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users", usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandlerUser)

module.exports = app