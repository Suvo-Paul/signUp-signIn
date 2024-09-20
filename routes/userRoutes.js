const express = require("express")
const userController = require("../controllers/userController")

const userRoute = express.Router()

userRoute.post("/signUp", userController.signUp)
userRoute.post("/logIn", userController.logIn)
userRoute.put("/forgetPassword", userController.forgetPassword)
userRoute.put("/resetPassword/:verificationCode", userController.resetPassword)
userRoute.get("/getAllUser", userController.getAllUser)

module.exports = userRoute

