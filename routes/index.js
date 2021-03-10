var express = require('express');
var router = express.Router();
const {Book} = require('../models');

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books')
}));

router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["title", "DESC"]]});
  res.render('index', {books: books, title: "All Books"});
}));

router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Article"});
}));

module.exports = router;
