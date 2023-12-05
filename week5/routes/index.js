// using the site told in the discord https://stackoverflow.com/questions/75649330/mongooseerror-model-findone-no-longer-accepts-a-callback-at-function
// and got some help to implement it from Atte

var express = require('express');
const mongoose = require("mongoose")
const multer  = require('multer')
const Recipes = require("../models/Recipes")
const Category = require("../models/Category")
const Images = require("../models/Images")
var router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// creating the names of the categories to the database
// Category.create({
//   name: 'Gluten-free'
// })
// Category.create({
//   name: 'Vegan'
// })
// Category.create({
//   name: 'Ovo'
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recipes' });
});

router.get("/recipe/:food", async (req, res, next) => {
  const foodName = req.params.food
  
  const recipe = await Recipes.findOne({name: foodName})
    if(!recipe){
        return res.status(403).send("Recipe not found")
    } else {
      res.json(recipe)
    }

  // foodName = req.params.food
  // instList = ["Step 1:", "Step 2:", "Step 3:"] 
  // indList = ["Ind1", "Ind2", "ind3", "Ind4"]

  // const recipe = {
  //   "name": foodName,
  //   "instructions": instList,
  //   "ingredients": indList 
  // }

  // res.json(recipe)
})

// router.post("/recipe/", (req, res) => {
//   const { name, ingredients, instructions } = req.body
//   const recipe = {
//     "name": name,
//     "instructions": instructions,
//     "ingredients": ingredients 
//   }
//   res.json(recipe)
// })

router.post("/recipe/", async (req, res, next) => {
  // const { name, ingredients, instructions } = req.body
  // checking to find the recipe and if not then creating it 
  const recipe = await Recipes.findOne({name: req.body.name})
  if(!recipe){
    await new Recipes({
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: req.body.ingredients,
      categories: req.body.categories,
      images: req.body.images
    }).save()
    res.status(200).json({success: true, message: "Recipe created"})
  } else {
    return res.status(403).send("Already has that recipe")
  }
})

// a route to fetch the categories from the database 
router.get("/categories", async (req, res, next) => {
  const categories = await Category.find()
  res.json(categories)
})

router.post("/images", upload.array("images"), async (req, res, next) => {
  const files = req.files
  imageIdList = []

  for (let i=0; i <files.length; i++){
    const newImage = await new Images({
      name: files[i].originalname,
      encoding: files[i].encoding,
      mimetype: files[i].mimetype,
      buffer: files[i].buffer,
    }).save()
    imageIdList.push(newImage._id)
  }

  // res.status(200).json(success: true, message: "Image uploaded", imageIdList})
  res.json(imageIdList)
  
  // const image = await Images.findOne({name: files.originalname})
  // if(!image){

    // res.json(imageId)
  // } else {
  //   return res.status(403).send("Already has that image")
  // }
})

router.get("/images/:imageId", async (req, res, next) => {
  const imageId = req.params.imageId
  const image = await Images.findById(imageId)

  if (!image) {
    return res.status(404).send("Image not found")
  }

  res.set("Content-Type", image.mimetype)
  res.set("Content-Disposition", `attachment; filename="${image.name}"`)
  res.send(image.buffer)
})

module.exports = router;