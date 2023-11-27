async function main() {
    const food = "Pizza"

    const response = await fetch(`/recipe/${food}`)
    
    if (response.ok) {
        const responseData = await response.json()
        // console.log(responseData)
        
        displayRecipe(responseData)
    } else {
        console.error('Failed to fetch recipe')
    }
}

function displayRecipe(recipe) {
    const recipeName = document.getElementById("recipeName")
    const recipeInst = document.getElementById("recipeInst")
    const recipeInd = document.getElementById("recipeInd")

    recipeName.innerText = `${recipe.name}`
    recipeInst.innerText = `Instructions\n${recipe.instructions.join('\n')}`
    recipeInd.innerText = `Ingredients\n${recipe.ingredients.join('\n')}`
}

let instList = []
let indList = []

document.getElementById("add-ingredient").addEventListener("click", async () => {
    const inputInd = document.getElementById("ingredients-text").value
    // console.log(inputInd)
    indList.push(inputInd)


    // Clearing the inputfield
    document.getElementById("ingredients-text").value = ""
})

document.getElementById("add-instruction").addEventListener("click", async () => {
    const inputInst = document.getElementById("instructions-text").value

    // console.log(inputInst)
    instList.push(inputInst)
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
    const dataReponse = await response.json()
    console.log(dataReponse)
})

document.getElementById("submit").addEventListener("click", async () => {
    const nameInput = document.getElementById("name-text")

    const responseData = {
        "name": nameInput.value,
        "instructions": instList,
        "ingredients": indList}

    const response = await fetch("/recipe/", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(responseData)
    }) 
    const dataReponse = await response.json()

    console.log(dataReponse)
})

document.addEventListener("DOMContentLoaded", main)