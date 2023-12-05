// got some advice to the enter eventlistener from here: https://stackoverflow.com/questions/14542062/eventlistener-enter-key

let instList = []
let indList = []
let catList = []
let imgList = []

async function main() {
    // making sure that the categories are fetched from the database when the page is loaded
    await fetchCategories()

    const inputSearchBar = document.getElementById("search-bar")

    // when the user searches a recipe this executes
    inputSearchBar.addEventListener("keypress", async function(e){
        if (e.key === "Enter"){
            const food = inputSearchBar.value

            //fetching the recipes "info"
            const response = await fetch(`/recipe/${food}`)

            if (response.ok){
                const responseData = await response.json()

                //sending the data to a function that does the displaying
                displayRecipe(responseData)
            } else {
                console.error('Failed to fetch recipe')
            }
        }
    })

    // const food = "Pizza"
    // const response = await fetch(`/recipe/${food}`)
    
    // if (response.ok) {
    //     const responseData = await response.json()
    //     // console.log(responseData)
        
    //     displayRecipe(responseData)
    // } else {
    //     console.error('Failed to fetch recipe')
    // }
}

async function fetchCategories(){
    const response = await fetch("/categories")
    if (response.ok){
        const categories = await response.json()

        displayCategories(categories)
    } else {
        console.error("Failed to fetch the categories")
    }
}

function displayCategories(categories){
    const categoriesElement = document.getElementById("categories")
    
    // after fetching the categories, displaying them as a buttons
    for (let i=0; i < categories.length; i++){
        const categoryButton = document.createElement("button")
        categoryButton.textContent = categories[i].name

        // when clicking the category button the id of the correct category is pushed to the list which is later on send to the database with the recipe
        categoryButton.addEventListener("click", function(){
            const categoryID = categories[i]._id

            if (!catList.includes(categoryID)) {
                catList.push(categoryID)
            }
        })
        categoriesElement.appendChild(categoryButton)
    }
}

function displayRecipe(recipe) {
    const recipeName = document.getElementById("recipeName")
    const recipeInst = document.getElementById("recipeInst")
    const recipeInd = document.getElementById("recipeInd")
    const imagesDiv = document.getElementById("images")

    // Clear previous images
    imagesDiv.innerHTML = ""

    // displaying the texts
    recipeName.innerText = `${recipe.name}`
    recipeInst.innerText = `Instructions:\n${recipe.instructions.join('\n')}`
    recipeInd.innerText = `Ingredients:\n${recipe.ingredients.join('\n')}`

    // displaying the images if there is any
    if (recipe.images && recipe.images.length > 0){
        for (let i = 0; i < recipe.images.length; i++) {
            const imageId = recipe.images[i]
            const imageElement = document.createElement("img")
    
            // setting the src so that the router.get("/images/:imageId") in the index.js will activate
            imageElement.src = `/images/${imageId}`
    
            //making the picture(s) look a bit prettier
            imageElement.style.width = "200px"
            imageElement.style.height = "200px"
            imagesDiv.appendChild(imageElement)
        }
    } else {
        console.log("Recipe has no image(s)")
    }   
}

document.getElementById("add-ingredient").addEventListener("click", async () => {
    const inputInd = document.getElementById("ingredients-text").value
    indList.push(inputInd)

    // Clearing the inputfield
    document.getElementById("ingredients-text").value = ""
})

document.getElementById("add-instruction").addEventListener("click", async () => {
    const inputInst = document.getElementById("instructions-text").value
    instList.push(inputInst)

    // Clearing the inputfield
    document.getElementById("instructions-text").value = ""
})

document.getElementById("image-input").addEventListener("change", async () => {
    const inputElement = document.getElementById("image-input").files
    const formData = new FormData()

    for (let i = 0; i < inputElement.length; i++ ){
        formData.append("images", inputElement[i])
    }

    const response = await fetch("/images", {
        method: "POST",
        body: formData
    }) 

    if (response.ok){
        const dataReponse = await response.json()
        imgList = dataReponse

    } else {
        console.log("error when trying to upload the image")
    }
})

document.getElementById("submit").addEventListener("click", async () => {
    const nameInput = document.getElementById("name-text")

    const responseData = {
        "name": nameInput.value,
        "instructions": instList,
        "ingredients": indList,
        "images": imgList,
        "categories": catList}

    try {
        const response = await fetch("/recipe/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responseData)
        })

        if (response.ok){
            const dataReponse = await response.json()
            catList = []
            indList = []
            instList = []
            imgList = []

            document.getElementById("name-text").value = ""
            document.getElementById("image-input").value = null
        } else {
            console.error("Failed to fetch the recipe")
        }
    } catch(error){
        console.error("Error during the fetch", error)
    }
})

document.addEventListener("DOMContentLoaded", main)