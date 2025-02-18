const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.json({ msg: "Hello world!" })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})