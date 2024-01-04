async function login() {
    const loginForm = document.getElementById("loginForm")

    if(loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault()

            const email = document.getElementById("email").value
            const password = document.getElementById("password").value

            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify( { email, password })
            })

            if (response.status == 200){
                const responseData = await response.json()
                console.log("Login successful: ", responseData)

                console.log("THE TOKEN: ", responseData.token)
                //saving the token to local storage
                localStorage.setItem('auth_token', responseData.token)

                console.log("Redirecting to /")
                //redirecting the user to the login page after registration
                window.location.href = '/'
            } else {
                const errorData = await response.json()
                console.error('Failed to register ', response.status, response.statusText)
                displayErrorMessage(errorData.message)
            }
        })
    }
}

function displayErrorMessage(message){
    const errorContainer = document.getElementById("errorContainer")
    
    errorContainer.innerHTML = ""
    
    const errorMessage = document.createElement("p")
    errorMessage.textContent = message
    errorMessage.style.color = "red"
    
    errorContainer.appendChild(errorMessage)
}

document.addEventListener("DOMContentLoaded", login)