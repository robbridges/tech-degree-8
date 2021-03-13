
const express = require('express');
const router = express.Router();
const {Book} = require('../models');
const { Op } = require ("sequelize");

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

router.get('/books/search', asyncHandler(async (req, res) => {
  const search = req.query.search;
  books = await Book.findAndCountAll({
    attributes: ['title', 'author', 'genre', 'year', 'id'],
   
    where:{
       [Op.or]:  [
         {
           title: {
             [Op.substring]: search
           }
         },
         {
           author: {
             [Op.substring]: search
           }
         },
         {
           genre:   {
            [Op.substring]: search
          }
         },
         {
           year:   {
            [Op.substring]: search
          }
         }

       ]

    },

  })
  res.render("index", { books: books.rows, id: books.id, search });
}));

router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["title"]]});
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
    throw error;
  } 
}));

router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors:error.errors});
    } else {
      throw error;
    }
  }
}));

router.post('/books/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect(`/books/${book.id}`);
    } else {
      throw error;
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
    book = await Book.build(req.body);
    book.id = req.params.id;
    res.render('book-detail', {book, errors: error.errors})
    } else {
      throw error;
    }

  }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy(req.body);
    res.redirect('/books');
  } else {
    throw error;
  }
  
}));


module.exports = router;
