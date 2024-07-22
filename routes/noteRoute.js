const express = require("express")

const noteController = require("../controllers/noteController")
const middleware = require("../middleware/middleware")

const noteRoute = express.Router()

noteRoute.post("/createNote", middleware.auth, noteController.createNote)

module.exports = noteRoute