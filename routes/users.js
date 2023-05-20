const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getMe,
} = require('../controllers/users');
const validateEmail = require('../errors/validate-email');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
}), updateProfile);

module.exports = router;
