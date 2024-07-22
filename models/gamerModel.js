const mongoose = require("mongoose")

const gamerSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    verficationCode: {
        type: String
    },
    verificationCodeExp: {
        type: Number
    }
}, { timestamps: true })

const gamerCollection = mongoose.model("gamers", gamerSchema)

module.exports = gamerCollection