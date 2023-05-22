const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const DataExistError = require('../errors/data-exist-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }).then((user) => {
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new DataExistError('Такой email уже зарегистрирован'));
      } else {
        next(err);
      }
    }));
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({
          _id: user._id,
          email: user.email,
          name: user.name,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidError('Некорректные данные'));
      } if (err.code === 11000) {
        next(new DataExistError('Такой email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }) });
    })
    .catch(next);
};
