const mongoose = require("mongoose")

const Schema = mongoose.Schema

// This tells what is going to be in the database collection
let userSchema = new Schema({
    email: String,
    password: String
})

module.exports = mongoose.model("User", userSchema)
