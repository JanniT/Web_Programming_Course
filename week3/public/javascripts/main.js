// i used this site to check how a button can be hidden: https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
// https://www.w3schools.com/tags/tag_li.asp

// Creating the buttons functionality (the adding task button)
document.getElementById("submit-data").addEventListener("click", async () => {
    const inputName = document.getElementById("input-name")
    const inputTask = document.getElementById("input-task")

    const textData = {
        "name": inputName.value,
        "task": inputTask.value}

    const response = await fetch("/todo", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(textData)
    }) 
    const dataReponse = await response.json()

    const responseMessage = document.getElementById("current-status")
    responseMessage.innerText = dataReponse.statusMessage

    inputName.value = ""
    inputTask.value = ""

    // console.log(textData)
    // console.log(responseMessage)
})

// Creating the functionality of the search button (containing the task 5 also)
document.getElementById("search").addEventListener("click", async () => {
    const searchName = document.getElementById("search-name")
    const responseName = document.getElementById("searchName")
    const responseTodo = document.getElementById("searchTodos")
    const deleteButton = document.getElementById("delete-user")

    // First getting the data from the get request
    const response = await fetch(`/user/${searchName.value}`)
    const resultData = await response.json()

    // console.log(resultData)

    // Then checking if the user is not found
    if (response.ok) {
        if (resultData.statusSearch === "User not found") {
            responseName.innerText = resultData.statusSearch
            responseTodo.innerText = ""

            // making that the deletebutton is not displayed still
            deleteButton.style.display = "none"
            searchName.value = ""

        // then just displaying the name and todos on the page
        } else {
            responseName.innerText = `Name: ${resultData.name}`
            responseTodo.innerText = `Todos: ${resultData.todos}`
            
            // making the delete button visible to the user
            deleteButton.style.display = "block"

            // Calling the function that creates the clickable element for the todos
            elementCreate(resultData, responseTodo)
        }
    }
})

// A function to create an element for a todo
const elementCreate = (resultData, responseTodo) => {
    // console.log(resultData)
    // console.log(responseTodo)

    for (let i = 0; i < resultData.todos.length; i++) {
        let elementLi = document.createElement("li")
        let deleteButton = document.createElement("button")

        deleteButton.className = "delete-task"
        deleteButton.textContent = resultData.todos[i]

        //Handling the button click and sending the todo to be deleted and name to get the deletion right
        deleteButton.onclick = () => {
            todoDeletion(resultData.name, resultData.todos[i], elementLi)
        }

        elementLi.appendChild(deleteButton)
        responseTodo.appendChild(elementLi)
    }
}

// A function to handle the deletion of a todo
const todoDeletion = async (userName, todoIndex, todoElement) => {
    console.log(userName)
    console.log(todoIndex)

    const responseTodo = document.getElementById("searchTodos")
    const response = await fetch("/user", {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({"name": userName, "taskIndex": todoIndex})
    }) 
    const dataReponse = await response.json()

    if (response.ok) {
        const responseMessage = document.getElementById("current-status")
        responseMessage.innerText = dataReponse.statusMessage

        if (todoElement) {
            responseTodo.removeChild(todoElement)
        }
    }
}

// Creating the functionality of the delete button
document.getElementById("delete-user").addEventListener("click", async () => {
    const searchName = document.getElementById("search-name")
    const responseName = document.getElementById("searchName")
    const responseTodo = document.getElementById("searchTodos")
    const deleteButton = document.getElementById("delete-user")

    // getting the response from the server
    const response = await fetch(`/user/${searchName.value}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        }
    }) 
    const dataReponse = await response.json()

    // displaying the server's response
    if (response.ok) {
        if (dataReponse.statusDelete === "User not found") {
            responseName.innerText = dataReponse.statusDelete
            responseTodo.innerText = ""

            // making that the deletebutton is not displayed still
            deleteButton.style.display = "none"

        // Then displaying the the success message
        } else {
            responseName.innerText = dataReponse.statusDelete
            responseTodo.innerText = ""
            
            // making the delete button visible to the user
            deleteButton.style.display = "none"
            searchName.value = ""
        }
    }
    // console.log(dataReponse)
})