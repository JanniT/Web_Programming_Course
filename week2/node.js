// I used the express documentation that is also linked in the task: https://expressjs.com/en/guide/routing.html#route-parameters

const express = require("express")
const app = express()
const port = 3000

app.use(express.json())

app.use(express.static("public"))

app.get("/hello", (req, res) => {
    res.json({
        msg: "Hello world"
    })
})

app.get("/echo/:id", (req, res) => {
    let id = req.params.id
    res.json({
        id: id
    })
})

app.post("/sum", (req, res) => {
    const numbersArray = req.body.numbers

    let summing = 0
    for (let i=0; i < numbersArray.length; i++) {
        summing += parseFloat(numbersArray[i])
    }

    res.json({
        sum: summing
    })
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

const textList = []
app.post("/list", (req, res) => {
    const textArray = req.body.text
    
    textList.push(textArray)
    
    res.json({
        list: textList
    })
})

app.listen(port, () => {
    console.log(`Server listening a port ${port}`)
})
