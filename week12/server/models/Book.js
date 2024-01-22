const mongoose = require('mongoose')

const Schema = mongoose.Schema

let BookSchema = new Schema({
    author: String,
    name: String,
    pages: Number
})

module.exports = mongoose.model('Book', BookSchema)