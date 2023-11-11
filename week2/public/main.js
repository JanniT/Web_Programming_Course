document.getElementById("submit-data").addEventListener("click", () => {
    const inputText = document.getElementById("input-text").value

    const textData = {"text": inputText}

    const url = "http://localhost:3000/list"

    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(textData)
    })
})