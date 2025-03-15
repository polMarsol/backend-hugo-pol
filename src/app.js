const express = require("express")
require("express-async-errors")
const { initDb } = require("./models")
const usersRouter = require("./controllers/users")
const middleware = require("./utils/middleware")

const app = express()
initDb()

app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/users", usersRouter)

app.use(middleware.unknownEndpoint)

module.exports = app