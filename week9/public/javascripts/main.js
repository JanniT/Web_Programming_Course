// I used this in help with redirecting the user to the login html: https://stackoverflow.com/questions/72586590/how-can-i-redirect-to-login-page-after-registration-in-this-code

async function main() {
    const registerForm = document.getElementById("registrationForm")

    if (registerForm) {
        registerForm.addEventListener("submit", async function(event) {
            event.preventDefault()

            const email = document.getElementById("email").value
            const password = document.getElementById("password").value
    
            // AW339.yj4
    
            const response = await fetch("/api/user/register/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify( { email, password })
            }) 

            if (response.status == 200){
                const responseData = await response.json()
                console.log("Registration successful: ", responseData)

                console.log("Redirecting to /login.html")
                //redirecting the user to the login page after registration
                window.location.href = '/login.html'
            } else {
                console.error('Failed to register ', response.status, response.statusText)
            }
        })
    }   
}

document.addEventListener("DOMContentLoaded", main)