const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const routes = require('./route/index')

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.use('/', routes)

module.exports = app;