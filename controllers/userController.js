"use strict"

const userCollection = require("../models/userModels")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "SECRET_KEY"

const signUp = async (req, res) => {
    try {
        const { name, email, mobileNo, password } = req.body

        const emailExists = await userCollection.findOne({ email: email })

        if (emailExists) {
            return res.send({
                success: false,
                status: 400,
                message: "Email alreay exists"
            })
        }

        const mobileNoExists = await userCollection.findOne({ mobileNo: mobileNo })

        if (mobileNoExists) {
            return res.send({
                success: false,
                status: 400,
                message: "mobile number alreay exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const response = await userCollection.create({
            name: name,
            email: email,
            mobileNo: mobileNo,
            password: hashPassword
        })

        return res.send({
            success: true,
            status: 200,
            message: "Account created successfully",
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
        const { email, mobileNo, password } = req.body

        const emailExists = await userCollection.findOne({ email: email })

        if (!emailExists) {
            return res.send({
                success: false,
                status: 400,
                message: "email not found",
            })
        }

        const mobileNoExists = await userCollection.findOne({ mobileNo: mobileNo })

        if (!mobileNoExists) {
            return res.send({
                success: false,
                status: 400,
                message: "mobileNo not found",
            })
        }

        const matchPasswordEmail = await bcrypt.compare(password, emailExists.password)

        const matchPasswordNumber = await bcrypt.compare(password, mobileNoExists.password)

        if (!matchPasswordEmail || !matchPasswordNumber) {
            return res.send({
                success: false,
                status: 400,
                message: "Password not matched",
            });
        }

        if (emailExists.password !== mobileNoExists.password) {
            return res.send({
                success: false,
                status: 400,
                message: "Password not matched",
            })
        }

        const token = jwt.sign({
            email: emailExists.email,
            mobileNo: mobileNoExists.mobileNo,
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
            error: error.message
        })
    }
}

const randomOTPgenarate = (length) => {
    let result = ""
    const characters = "0123456789"

    const characterLength = characters.length

    let counter = 0

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characterLength))
        counter += 1
    }
    return result
}

const forgetPassword = async (req, res) => {
    try {
        const { email, mobileNo } = req.body

        if (!email && !mobileNo) {
            throw new Error("Pleaase enter email or mobile number")
        }

        let user = ""

        if (email) {
            user = await userCollection.findOne({ email: email })
        }

        if (!user && mobileNo) {
            user = await userCollection.findOne({ mobileNo: mobileNo })
        }

        if (!user) {
            throw new Error("Please enter valid email or mobile number")
        }

        const response = await userCollection.findOneAndUpdate({ _id: user._id },
            {
                $set: {
                    verificationCode: randomOTPgenarate(6),
                    verificationCodeExp: new Date(
                        new Date().getTime() + 1 * 60 * 60 * 1000
                    )
                }
            }, { new: true }
        )

        return res.send({
            success: true,
            status: 200,
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

const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body

        const verificationCode = req.params.verificationCode

        const user = await userCollection.findOne({ verificationCode: verificationCode })

        if (!user) {
            return res.send({
                success: false,
                status: 400,
                message: "Invalid User"
            })
        }

        if (user.verificationCodeExp < new Date().getTime()) {
            return res.send({
                success: false,
                status: 400,
                message: "code expired"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.send({
                success: false,
                status: 400,
                message: "Password not matched"
            })
        }

        const response = await userCollection.findOneAndUpdate({ _id: user._id },
            {
                $set: {
                    password: await bcrypt.hash(newPassword, 10)
                },
                $unset: {
                    verificationCode: 1,
                    verificationCodeExp: 1
                }
            }
        )

        return res.send({
            success: true,
            status: 200,
            message: "password reset successfully",
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

const getAllUser = async (req, res) => {
    try {
        const response = await userCollection.find({})

        return res.status(200).send({
            success: true,
            message: "User data get successfully",
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

module.exports = { signUp, logIn, forgetPassword, resetPassword, getAllUser }