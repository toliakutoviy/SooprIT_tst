const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const auth = require('@controllers').auth;
const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(auth.passport.initialize());

require('@routes')(app);
app.all('*', (req, res) => res.status(404).send({
  error: 'wrong route',
}));

module.exports = app;