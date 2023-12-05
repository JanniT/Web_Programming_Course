// // I got advice of passing a list of strings to db from here: https://stackoverflow.com/questions/67745436/pass-array-of-string-to-mongodb-schema
const mongoose = require("mongoose")

const Schema = mongoose.Schema

// This tells what is going to be in the database collection
let recipeSchema = new Schema({
    name: String,
    instructions: [{type: String}],
    ingredients: [{type: String}],
    images: [{type: Schema.Types.ObjectId, ref: "Images"}],
    categories: [{type: String}]  
})

module.exports = mongoose.model("Recipes", recipeSchema)