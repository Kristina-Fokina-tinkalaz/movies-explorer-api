const express = require('express');

const auth = require('../middlewares/auth');

const app = express();

app.use('/', require('./auth'));
app.use('/movies', auth, require('./movies'));
app.use('/users', auth, require('./users'));

module.exports = app;
