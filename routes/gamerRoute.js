const express = require("express")

const gamerController = require("../controllers/gamerController")
const middleware = require("../middleware/middleware")

const gamerRoute = express.Router()

gamerRoute.post("/createGamer", gamerController.signUp)
gamerRoute.post("/logInGamer", gamerController.logIn)
gamerRoute.put("/forgetPassword", gamerController.forgetPassword)
gamerRoute.put("/resetPassword/:verficationCode", gamerController.resetPassword)
gamerRoute.get("/createGamer", middleware.auth, gamerController.createGamer)

module.exports = gamerRoute;