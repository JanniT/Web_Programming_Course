const mongoose = require("mongoose")

const Schema = mongoose.Schema

// This tells what is going to be in the database collection
let categorySchema = new Schema({
    name: String
})

module.exports = mongoose.model("Category", categorySchema)
