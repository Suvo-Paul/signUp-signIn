const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
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
    verificationCode: {
        type: String
    },
    verificationCodeExp: {
        type: Number
    }
}, { timestamps: true })

const userCollection = mongoose.model("users", userSchema)

module.exports = userCollection