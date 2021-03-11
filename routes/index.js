const e = require('express');
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
  res.redirect('/books');
}));

router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["title", "DESC"]]});
  res.render('index', {books: books, title: "All Books"});
}));

router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book"});
}));

router.get('/books/:id', asyncHandler(async (req, res) => {
  const book =await Book.findByPk(req.params.id);
  if(book) {
    res.render("book-detail", {book, title: book.title });
  } else {
    throw error;
  }
   
}));

router.get('/books/:id/delete', asyncHandler(async (req, res) => {
  const book =await Book.findByPk(req.params.id);
  if(book) {
    res.render("delete-book", {book, title: book.title });
  } else {
    res.sendStatus(404);
  } 
}));

router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  if (book) {
  res.redirect(`/books/${book.id}`);
  } else {
    res.sendStatus(404);
  }

}));

router.post('/books/:id/edit', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
  await book.update(req.body);
  res.redirect(`/books/${book.id}`);
  } else {
    res.sendStatus(404);
  }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy(req.body);
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
  
}));


module.exports = router;
