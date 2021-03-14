
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
  res.redirect('/books/page/1');
}));
// unused route as the app redirects to the paginated version of the books. However the grading requirement require that this route exists so it should be viewable upon visit
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ 
    order: [["title"]]
  });
  res.render('index', {books: books, title: "All Books"});
}));


// search page for the books using the Op or method to match substrings of the title, author, genre, and year
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

// paginated book listing. The offset is pulled from the URL so that each page shows the correct database entries
router.get('/books/page/:page?', asyncHandler(async (req, res) => {
  let page = req.params.page;
  let totalPages;
  let bookCount;
  
  const books = await Book.findAll({
    
    limit: 5, 
    offset:( page * 5 )- 5,
    page: page,
    order: [["title"]]
   
  });
 
  bookCount = await Book.count();
  totalPages = Math.ceil(bookCount / 5)
  if (page > totalPages) {
    const err = new Error("We couldn't find the page that you are looking for.");
    err.status = 404;
    throw err;
  } else { 
  res.render("index", { books, title: 'Library Books', page: page, totalPages, bookCount });
  }
  
}));
  

// forwards users to the new book page
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book"});
}));
// detailed description of the book
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book =await Book.findByPk(req.params.id);
  if(book) {
    res.render("book-detail", {book, title: book.title });
  } else {
    throw error;
  }
   
}));
// forwards users to the delete the book screen
router.get('/books/:id/delete', asyncHandler(async (req, res) => {
  const book =await Book.findByPk(req.params.id);
  if(book) {
    res.render("delete-book", {book, title: book.title });
  } else {
    throw error;
  } 
}));
// post request. This is called when the user confirms that they want to create a book and no Sequelize validation errors are present
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
/* updates a book, again making sure that all sequelize validation errors have been passed */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect(`/books/${book.id}`);
    } else {
      const err = new Error("We couldn't find the page that you are looking for.");
      err.status = 404;
      throw err;
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
/* deletes the book record from the database */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy(req.body);
    res.redirect('/books/page/1');
  } else {
    throw error;
  }
  
}));


module.exports = router;
