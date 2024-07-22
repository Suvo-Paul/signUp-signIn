"use strict"

const gamerCollection = require("../models/gamerModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "SECRET_KEY"

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const emailExists = await gamerCollection.findOne({ email: email })

        if (emailExists) {
            return res.send({
                success: false,
                status: 400,
                message: "email already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const response = await gamerCollection.create({
            username: username,
            email: email,
            password: hashPassword
        })

        return res.send({
            success: true,
            status: 200,
            message: "account created successfully",
            data: response
        })
    } catch (error) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal server error",
            data: error.message
        })
    }
}

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body

        const emailExists = await gamerCollection.findOne({ email: email })

        if (!emailExists) {
            return res.send({
                success: false,
                status: 400,
                message: "email not found"
            })
        }

        const matchPassword = await bcrypt.compare(password, emailExists.password)

        if (!matchPassword) {
            return res.send({
                success: false,
                status: 400,
                message: "password not matched"
            })
        }

        const token = jwt.sign({
            email: emailExists.email,
            id: emailExists._id
        }, SECRET_KEY)

        return res.send({
            success: true,
            status: 200,
            message: "Log in successfully",
            token: token,
            data: emailExists
        })
    } catch (error) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal server error",
            data: error.message
        })
    }
}


// ===================== Random string generate==============//

const randomStringGenerate = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const characterLength = characters.length

    let counter = 0

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characterLength))
        counter += 1
    }
    return result
}

//=================== Forget Password =====================//

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (email == undefined) throw "Please enter email address"

        const emailExists = await gamerCollection.findOne({ email: email })

        // if (!emailExists) {
        //     return res.send({
        //         success: false,
        //         status: 400,
        //         message: "please enter valid email address"
        //     })
        // }

        if (!emailExists) throw new Error("please enter valid email address")

        const response = await gamerCollection.findOneAndUpdate({ email: email },
            {
                $set: {
                    verficationCode: randomStringGenerate(6),
                    verificationCodeExp: new Date(
                        new Date().getTime() +  60 * 60 * 1000
                    )
                }
            }, { new: true }
        )

        return res.send({
            success: true,
            data: response
        })
    } catch (error) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message
        })
    }
}

//=============== Reset password ==================//

const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body

        const verficationCode = req.params.verficationCode

        const exVerificationCode = await gamerCollection.findOne({ verficationCode: verficationCode })

        if (exVerificationCode == null) {
            return res.send({
                success: false,
                status: 400,
                message: "Invalid user"
            })
        }

        if (exVerificationCode.verificationCodeExp < new Date().getTime()) {
            return res.send({
                success: false,
                status: 400,
                message: "Code expired"
            })
        }

        const response = await gamerCollection.findOneAndUpdate({ _id: exVerificationCode._id },
            {
                $set: {
                    password: await bcrypt.hash(newPassword, 10)
                },
                $unset: {
                    verficationCode: 1,
                    verificationCodeExp: 1
                }
            }
        )

        return res.send({
            success: true,
            status: 200,
            message: "reset password successfully",
            data: response
        })
    } catch (error) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal server error",
            data: error.message
        })
    }
}

const createGamer = async (req, res) => {
    try {
        const body = req.body

        const response = await gamerCollection.create(body)

        return res.send({
            success: true,
            status: 200,
            message: "data created",
            data: response
        })
    } catch (error) {
        return res.send({
            success: false,
            status: 500,
            message: "internal server error",
            data: error.message
        })
    }
}

module.exports = { signUp, logIn, forgetPassword, resetPassword, createGamer }