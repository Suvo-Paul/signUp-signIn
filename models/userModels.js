const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    mobileNo: {
        type: Number,
        unique: true
    },
    password: {
        type: String
    },
    verificationCode: {
        type: String
    },
    verificationCodeExp: {
        type: Number
    }
}, { timestamps: true })

const userCollection = mongoose.model("users", userSchema)

module.exports = userCollection