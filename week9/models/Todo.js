const mongoose = require("mongoose")

const Schema = mongoose.Schema

// This tells what is going to be in the database collection
let todoSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    items: [String]
})

module.exports = mongoose.model("Todo", todoSchema)
