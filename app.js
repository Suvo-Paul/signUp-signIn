const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
const bodyParser = require("body-parser")

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))

dotenv.config()

const port = process.env.PORT || 4002
require("./db")

const userRoute = require("./routes/userRoutes")
const gamerRoute = require("./routes/gamerRoute")
const noteRoute = require("./routes/noteRoute")

app.use("/api/user", userRoute)
app.use("/api/gamer", gamerRoute)
app.use("/api/note", noteRoute)

app.listen(port, () => {
    console.log("Server is running on", port);
})