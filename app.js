const express = require("express")
const app = express()
const dotenv = require("dotenv")
app.use(express.json())

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