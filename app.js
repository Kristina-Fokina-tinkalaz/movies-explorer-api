const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { NODE_ENV, DB_URL } = process.env;
const app = express();

if (NODE_ENV === 'production') {
  mongoose.connect(DB_URL);
} else {
  mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
}

app.use(express.json());

app.use(requestLogger);
app.use(helmet());
app.use('/', require('./routes'));

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
