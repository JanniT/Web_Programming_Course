const mongoose = require("mongoose")

const Schema = mongoose.Schema

// This tells what is going to be in the database collection
let imageSchema = new Schema({
    name: String,
    encoding: String,
    mimetype: String,
    buffer: Buffer,
})

module.exports = mongoose.model("Images", imageSchema)