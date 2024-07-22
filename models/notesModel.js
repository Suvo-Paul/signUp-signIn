const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobileNo : {
        type : Number
    }
}, { timestamps: true })

const noteCollection = mongoose.model("notes", noteSchema)

module.exports = noteCollection