// I used this in help of creating the jwt tokens: https://mattermost.com/blog/json-web-token-jwt-authentication-in-nodejs-applications/
// had problem with .env and used this in help: https://stackoverflow.com/questions/58673430/error-secretorprivatekey-must-have-a-value
// fixing the arrays: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')

const jwt = require("jsonwebtoken")
const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt  = require('passport-jwt').ExtractJwt
const { body, validationResult } = require('express-validator')

const Users = require("../models/Users");
const Todo = require("../models/Todo");
require('dotenv').config()

router.use(passport.initialize())

// THIS CODE IS MADE WITHOUT THE PASSPORT AS I FISRT TRIED THIS BUT DECIDED TO USE THE CORRECT WAY
// // middleware for JWT authentication 
// const authenticateJWT = async (req, res, next) => {
//   const token = req.headers.authorization
//   // console.log("Received token:", token)
//   try {
//     // verifying the token using the secret key, taking the word out of the token
//     const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET)
//     // console.log("Decoded ", decoded)
//     //finding the user from db
//     const user = await Users.findOne({ email: decoded.email })
//     if (!user){
//       res.status(401).send("User not found")
//     }
//     req.user = user
//     next()
//   } catch (err){
//     res.status(401).send("Unauthorized")
//   }
// }

// options for the passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
}

// passport uses jwt strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // console.log("Payload from the token: ", payload)
      // finding the user from the db
      const user = await Users.findOne( {email: payload.email })

      if (user){
        return done(null, user) //succesfull 
      } else {
        return done(null, false)  //authentication fails
      }
    } catch (error){
      return done(error, false)
    }
  })
)

//middleware for JWT authentication using passport
const authenticateJWT = passport.authenticate("jwt", { session: false })

//middleware for password & email validation
const validateRegister = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength( {min: 8 })   
    .matches(/(?=.*[a-z])/) //lowecase letter
    .matches(/(?=.*[A-Z])/) //uppercase letter
    .matches(/(?=.*\d)/)    //one number
    .matches(/(?=.*[~`!@#$%^&*()-_+={}[\]\\|;:"<>,./?])/)
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main page', user: req.user });
});

router.get("/register.html", function(req,res,next) {
  res.render('register', { tittle: "User Registration"})
})

router.get("/login.html", function(req,res,next) {
  res.render('login', { tittle: "Login"})
})

router.post("/api/user/register/",  validateRegister, async(req,res) => {
  //checking if any validation errors occur
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json( { message: "Password is not strong enough"})
  }
  
  const email = req.body.email
  const password = req.body.password

  try {
    //Checking first that the email is not already used
    const userExisting = await Users.findOne({ email })

    if (!userExisting){
      //When knowing that the email is free, lets hash the password
      const hashPassword = await bcrypt.hash(password, 10)
      
      // Creating the user with the hashed password and saving it to the database
      const newUser = new Users ({
        "email": email,
        "password": hashPassword
      })

      await newUser.save()
  
      res.status(200).json({ message: "Registration successful"})
    } else {
      return res.status(403).json({ message: "Email already in use"})
    }
  } catch (error){
    console.error("Error creating user: ", error)
    res.status(500).json({ error: "Internal server error"})
  }
})

router.post("/api/user/login", async(req,res) => {
  const email = req.body.email
  const password = req.body.password

  if (!password || !email) {
    res.status(401).send( {message: "Invalid credentials" })

  } else {
    try {
      // finding the correct user from db via the email given
      const user = await Users.findOne( { email })

      // Checking if the password matches with the database password
      const matchingPassword = await bcrypt.compare(password, user.password)

      if (!matchingPassword){
        res.status(401).send( {message: "Invalid credentials" })
      } else {
        // Creating the JWT token
        const token = jwt.sign( {email: user.email}, process.env.SECRET, {
          expiresIn: '1h'
        })
        res.status(200).json( {success: true, token})
      }
    } catch (error){
      // console.error("Error comparing passwords: ", error)
      res.status(401).send({ message: "Invalid credentials"})
    }
  }
})

router.get("/api/private", authenticateJWT, (req,res) => {
  res.status(200).json(req.user)
})

router.get("/api/todos", authenticateJWT, async (req, res) => {
  try {
    const user = req.user._id
    
    const userTodo = await Todo.findOne({ user })

    if (userTodo) {
      res.status(200).json(userTodo.items)
    } else {
      // returning empty array if there isn't any todos
      res.status(200).json([])
    }
  } catch (error){
    console.error("Error fetching todos: ", error)
    res.status(500).send("Internal server error")
  }
})

router.post("/api/todos", authenticateJWT, async (req,res) => {
  try {
    // console.log("req.user: ", req.user)
    const user = req.user._id
    const { items } = req.body

    //finding the previous todo
    const previousTodo = await Todo.findOne({ user }) 

    if (previousTodo){
      //if there is previous todos, appending to the list
      previousTodo.items = previousTodo.items.concat(items)
      await previousTodo.save()
      console.log("Todo updated")
      res.status(200).send("ok")
    } else {
      //if no previous todos, creting new
      const newTodo = new Todo( { user, items })
      await newTodo.save()
      console.log("Todo created")
      res.status(200).send("ok")
    }
  } catch (error) {
    res.status(401).send("Error creating/updating todo ", error)
  }  
}) 

module.exports = router;
