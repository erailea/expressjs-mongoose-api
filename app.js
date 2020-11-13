const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const movieRouter = require('./routes/movie');
const directorRouter = require('./routes/director');

const app = express();

// db setup
require('./helpers/db')();

//jwt secret key
const config = require('./helpers/config')
app.set('api_secret_key', config.api_secret_key)

// Middleware
const verifyToken = require('./middlewares/verify-token')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/movies', verifyToken, movieRouter);
app.use('/api/directors', verifyToken, directorRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      code: error.code
    }
  });
});

module.exports = app;
