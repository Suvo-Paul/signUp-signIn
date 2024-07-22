"use strict"

const noteCollection = require("../models/notesModel")

const createNote = async (req, res) => {
    try {
        const body = req.body
        const response = await noteCollection.create(body)

        return res.send({
            success: true,
            status: 200,
            message: "Note created",
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

module.exports = { createNote }