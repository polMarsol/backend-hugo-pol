const express = require("express")
require("express-async-errors")
const cors = require("cors")
const { initDb } = require("./models")
const middleware = require("./utils/middleware")
const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")
const usersRouter = require("./controllers/users")
const shopsRouter = require("./controllers/shop")
const ordersRouter = require("./controllers/order")
const ProductsRouter = require("./controllers/product")
const loginRouter = require('./controllers/login')

const app = express()
app.use(cors())

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
app.use("/api/shops", shopsRouter)
app.use("/api/order", ordersRouter)
app.use("/api/products", ProductsRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandlerUser)
app.use(middleware.errorHandlerProduct)
app.use(middleware.checkAdmin)

module.exports = app