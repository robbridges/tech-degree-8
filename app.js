var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {sequelize, Books} = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// setting up the database
(async ()=> {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('You are connected to the database.');
  } catch (error) {
    console.error('Uht oh, we could not connect:', error);
  }

})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("We couldn't find the page that you are looking for.");
  err.status = 404;
  next(err);
});

/*
Middleware to handle errors 
*/
app.use(function(err, req, res, next) {
  res.locals.error = err;
  res.status(err.status);
  console.error(`There was an ${err.status} error`);
  console.error(err.stack);
  if (err.status = 404) {
    res.render('page-not-found', {error: err});
  } else {
    res.render('error', {error: err} );
  }
});

module.exports = app;
