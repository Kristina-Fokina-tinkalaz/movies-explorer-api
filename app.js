const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb',);

app.use(express.json());

app.use(requestLogger);

app.use('/', require('./routes/auth'));
app.use('/movies', auth, require('./routes/movies'));
app.use('/users', auth, require('./routes/users'));

app.use(() => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? { message }
      : message,
  });
  next();
});
app.listen(PORT);
module.exports = router;
