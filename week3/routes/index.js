var express = require('express')
var router = express.Router()
router.use(express.json())

/* GET home page. */
// Creating the first task to have the "my todos" on somewhere on the page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My todos' })
})

let taskList = []

router.post("/todo", (req, res) => {
  const inputName = req.body.name
  const inputTask = req.body.task
  let isFound = false

  // Creating a for loop to check if the list contains the name already
  for (let i = 0; i < taskList.length; i++){
    if (taskList[i].name === inputName) {
      taskList[i].todos.push(inputTask)
      isFound = true
      res.json({ statusMessage: "Todo added" })
      break
    }
  }

  // If it doesn't contain the name, the name and todo will be added to the list
  if (!isFound) {
    taskList.push({ name: inputName, todos: [inputTask]} )
    res.json({ statusMessage: "User added" })
  }
  // console.log(taskList)
}) 

router.get("/user/:id", (req, res) => {
  let isFound = false
  let id = req.params.id
  
  // checking to find the user from the list and it responses with the stuff of the correct name
  for (let i = 0; i < taskList.length; i++) {
    if (id === taskList[i].name) {
      isFound = true
      res.json(taskList[i])
    }
  }

  if (!isFound) {
    res.json({ statusSearch: 'User not found' })
  }
})

router.delete("/user/:id", (req, res) => {
  let id = req.params.id

  // setting the index of the user as -1 as list indexes start from 0
  let indexUser = -1
  
  // checking to find the index of the name to be deleted
  for (let i = 0; i < taskList.length; i++) {
    if (id === taskList[i].name) {
      indexUser = i
      break
    }
  }

  // I had a problem with the deleting from the list and asked help from my friend Atte who said that 
  // "splice" function would be better to use when deleting from list
  // I searched it up and used this also as a guide: https://sentry.io/answers/remove-specific-item-from-array/

  if (indexUser === -1) {
    res.json({ statusDelete: "User not found" })
  } else {
    taskList.splice(indexUser, 1)
    res.json({ statusDelete: "User deleted" })
  }
})

router.put("/user", (req, res) => {
  const userName = req.body.name
  const taskIndex = req.body.taskIndex

  // setting the index of the user as -1 as list indexes start from 0
  let indexUser = -1

  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].name === userName) {
      indexUser = i
      break
    }
  }

  if (indexUser === -1) {
    res.json({ statusMessage: "User not found" })
  } else {

    // Find the todo index based on the task text
    const todoIndex = taskList[indexUser].todos.findIndex(todo => todo === taskIndex)

    if (todoIndex !== -1) {
        taskList[indexUser].todos.splice(todoIndex, 1)
        res.json({ statusMessage: "Task deleted" })
    } else {
        res.json({ statusMessage: "Invalid task index" })
    }
}
})
module.exports = router