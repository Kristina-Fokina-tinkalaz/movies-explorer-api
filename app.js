const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const { NODE_ENV } = process.env;
const app = express();

if (NODE_ENV === 'production') {
  mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb');
} else {
  mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
}

app.use(express.json());

app.use(requestLogger);
app.use(helmet());
app.use('/', require('./routes'));

app.use(auth, () => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ошибка сервера'
      : message,
  });
  next();
});
app.listen(PORT);

module.exports = { router, app };
