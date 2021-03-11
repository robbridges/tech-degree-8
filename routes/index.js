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
  res.render("book-detail", {book, title: book.title }); 
}));

router.get('/books/:id/delete', asyncHandler(async (req, res) => {
  const book =await Book.findByPk(req.params.id);
  res.render("delete-book", {book, title: book.title }); 
}));

router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  
  res.redirect(`/books/${book.id}`);
}));

router.post('/books/:id/edit', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect(`/books/${book.id}`);
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy(req.body);
  res.redirect('/books');
}));


module.exports = router;
