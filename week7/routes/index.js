
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

router.use(session({
  secret: "secret-key",
  resave: false, 
  saveUninitialized: false
}))

router.use(passport.initialize())
router.use(passport.session())

router.use(express.json())
const userList = []
const todosList = []

// Middleware to check the authentication
const authenticateUser = (req, res, next) => {
  // console.log("session object", req.session)
  // console.log("Session user:", req.session.passport && req.session.passport.user)
  if (req.session.passport && req.session.passport.user){
    next()
  } else {
    console.log("unauthorized")
    res.status(401).send()
  }
}

// Middleware to check if the user is already logged in
const redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){
    console.log("is logged in")
    return res.redirect("/")
  }
  next()
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//router for new user registration
router.post("/api/user/register", redirectIfLoggedIn, async (req, res) => {
  givenUsername = req.body.username
  givenPassword = req.body.password

  for (let i=0; i < userList.length; i++) {
    if (userList[i].username === givenUsername){
      console.log("Username taken")
      return res.status(400).send()
    }
  }
  const hashPassword = await bcrypt.hash(givenPassword, 10)
  const newUser = {
    "id": userList.length + 1,
    "username": givenUsername,
    "password": hashPassword
  }
  userList.push(newUser)
  res.json(newUser)
})

//router to list all the users
router.get("/api/user/list", async(req, res) => {
  res.json(userList)
})

// configuring a local strategy for passport authentication
passport.use(new LocalStrategy(
  async (username, password, done) => {
    console.log("attempting to authenticate with username", username)

    // checking if the user is found and saving it to founduser
    let foundUser = null
    for (let i=0; i < userList.length; i++) {
      if (userList[i].username === username){
        foundUser = userList[i]
        break
      }
    }

    // If the user is not found, return with an error message
    if (!foundUser){
      console.log("Wrong username")
      return done(null, false)
    }

    // checking if the passwords match
    const passportMatch = await bcrypt.compare(password, foundUser.password)
    if (!passportMatch){
      console.log("wrong password")
      return done(null, false)
    }
    
    // If everything is fine, return the found user
    return done(null, foundUser)
  }
))

//making the functions that maintain the login session
passport.serializeUser((user, done) => {
  console.log('Serialized User: ', user.id)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  console.log('Deserialized User: ', id)
  let foundUser = null
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].id === id) {
      foundUser = userList[i]
      break
    }
  }
  done(null, foundUser)
})

router.post("/api/user/login", redirectIfLoggedIn, passport.authenticate('local'), (req, res) => {
  req.session.save(() => {
    res.status(200).send()
  })
})

router.get("/api/secret", authenticateUser, (req, res) => {
  res.status(200).send()
})

router.post("/api/todos", authenticateUser, (req, res) => {
  const userId = req.user.id
  // console.log(userId)

  let foundUser = null
  for (let i = 0; i < todosList.length; i++) {
    if (todosList[i].id === userId) {
      foundUser = todosList[i]
      break
    }
  }
  console.log("Found user: ", foundUser)
  
  // if the user doesn't have a todo list, it will be created
  if(!foundUser){
    const newTodo = {
      "id": userId,
      "todos": [req.body.todo]
    }
    todosList.push(newTodo)
    console.log(todosList)
    res.json(newTodo)
  } else {
    // If the user already has a todo list, updating it
    foundUser.todos.push(req.body.todo)
    res.json(foundUser)
  }
})

router.get("/api/todos/list", authenticateUser, (req, res) => {
  // const userId = req.user.id

  // let allTodos = []
  // for (let i = 0; i < todosList.length; i++) {
  //   // Compare the user ID as a number
  //   if (todosList[i].id === Number(userId)) {
  //     allTodos.push(todosList[i])
  //   }
  // }
  // console.log(allTodos)
  // res.json(allTodos)
  res.json(todosList)
})

module.exports = router;