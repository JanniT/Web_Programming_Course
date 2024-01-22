const express = require('express');
const mongoose = require('mongoose')
const Book = require('..//models/Book')
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/book/', async (req, res, next) => {
  console.log(req.body)
  try {
    const { author, name, pages } = req.body;

    // creating a new book instance
    const newBook = new Book({
      author,
      name,
      pages,
    })

    // saving the book to database
    await newBook.save()

    res.status(201).json({ message: 'Book saved successfully!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

module.exports = router;