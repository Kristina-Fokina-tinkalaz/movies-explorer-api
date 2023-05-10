const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

// eslint-disable-next-line no-undef
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb',);

app.use(express.json());

app.use(requestLogger);

app.use('/', require('./routes/auth'));
app.use('/movies', auth, require('./routes/movies'));
app.use('/users', auth, require('./routes/users'));

app.use(auth, () => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? { message : 'Ошибка сервера'}
      : message,
  });
  next();
});
app.listen(PORT);
module.exports = router;