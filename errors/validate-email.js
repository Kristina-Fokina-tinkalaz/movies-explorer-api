const validator = require('validator');

const validateEmail = (value) => {
  if (!validator.isEmail(value, { require_protocol: true })) {
    throw new Error('Неправильный формат email');
  }
  return value;
};
module.exports = validateEmail;
