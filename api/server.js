// Carregar módulos do express, body-parser e do mongodb
var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb');

// Instanciar o express
var app = express();

// Instanciar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar porta
var port = 8080;
app.listen(port);

console.log('Servidor HTTP está escutando na porta ' + port);
