const express = require('express');

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const app = express();

app.use('/', require('./auth'));
app.use('/movies', auth, require('./movies'));
app.use('/users', auth, require('./users'));

app.use(auth, () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = app;
