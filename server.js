const bodyparser = require('body-parser');
const express = require('express');

const escolarroute = require('./router/escolar.router')();

let app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use('/v1/controlescolar', escolarroute);

module.exports = app;