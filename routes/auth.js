const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const validateEmail = require('../errors/validate-email');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(8),
  }),
}), login);
module.exports = router;