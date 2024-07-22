const mongoose = require("mongoose")

const gamerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim :true
    },
    email: {
        type: String,
        lowercase : true,
        unique: true,
        trim : true,
        required: true
    },
    mobileNo: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
        required: [true,"Password is required"]
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