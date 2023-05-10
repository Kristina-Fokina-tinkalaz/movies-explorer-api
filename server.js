const app = require('./app');
// eslint-disable-next-line no-undef
const { PORT = 3000 } = process.env;

app.listen(PORT);