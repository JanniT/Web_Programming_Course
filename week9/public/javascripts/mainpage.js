async function main() {
    const loggedInContainer = document.getElementById('loggedInContainer')
    const loggedOutContainer = document.getElementById('loggedOutContainer')
    const emailElement = document.getElementById('email')
    
    const token = localStorage.getItem('auth_token')
    if(token){
        try {
            const response = await fetch('/api/private', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        
            if (response.status === 200) {
                const user = await response.json()
                // console.log(user)
        
                loggedOutContainer.style.display = 'none'
                loggedInContainer.style.display = 'block'
        
                //showing the logged in user
                emailElement.textContent = `${user.email}`

                // creating logout button
                const logoutButton = document.createElement('button')
                logoutButton.id = 'logout'
                logoutButton.className = 'btn'
                logoutButton.textContent = 'Logout'
            
                logoutButton.addEventListener('click', function () {
                    // removing the token from the local storage
                    localStorage.removeItem('auth_token')
                    // redirecting
                    window.location.href = '/'
                })
                loggedInContainer.appendChild(document.createElement('br'))
                loggedInContainer.appendChild(logoutButton)

                addingTodos()
                loadExistingTodos()
            } else {
              // user not logged in
              loggedOutContainer.style.display = 'block'
              loggedInContainer.style.display = 'none'
            }
        } catch (error) {
        console.error('Error fetching user information:', error)
        // just showing the links
        loggedOutContainer.style.display = 'block'
        loggedInContainer.style.display = 'none'
        }
    }
}

async function addingTodos() {
    const todoInput = document.getElementById("add-item")

    todoInput.addEventListener("keydown", async function (event){
        if (event.key === "Enter") {
            const newTodo = todoInput.value.trim()

            if (newTodo !== ""){
                await addTodoDatabase(newTodo)
                todoInput.value =""
            }
        }
    })
}

async function addTodoDatabase(newTodo) {
    const token = localStorage.getItem("auth_token")

    if(token) {
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: [newTodo] })
            })

            if (response.status === 200) {
                console.log("Todo added succesfully")
                loadExistingTodos()
            } else {
                console.error("Failed to add todo to the database")
            }
        } catch (error) {
            console.error("Error adding todo to the database", error)
        } 
    }
}

async function loadExistingTodos() {
    const todoContainer = document.getElementById("todoContainer")
    const todosList = document.getElementById('todos')
    const token = localStorage.getItem("auth_token")

    if (token){
        try{
            const response = await fetch('/api/todos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.status === 200) {
                const todos = await response.json()

                todosList.innerHTML = ""
                todos.forEach(todo => {
                    const li = document.createElement("li")
                    li.textContent = todo
                    todosList.appendChild(li)
                })
            } else {
                console.error("Failed to load todos")
            }
        } catch (error) {
            console.error("Error loading todos: ", error)
        }
    }
}

document.addEventListener("DOMContentLoaded", main)