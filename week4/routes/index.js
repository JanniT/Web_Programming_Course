var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recipes' });
});

router.get("/recipe/:food", (req, res) => {
  foodName = req.params.food
  instList = ["Step 1:", "Step 2:", "Step 3:"] 
  indList = ["Ind1", "Ind2", "ind3", "Ind4"]

  const recipe = {
    "name": foodName,
    "instructions": instList,
    "ingredients": indList 
  }

  res.json(recipe)
})

router.post("/recipe/", (req, res) => {
  const { name, ingredients, instructions } = req.body

  const recipe = {
    "name": name,
    "instructions": instructions,
    "ingredients": ingredients 
  }
  res.json(recipe)
})

router.post("/images", (req, res) => {
  
  res.json("Image ok")
})

module.exports = router;
