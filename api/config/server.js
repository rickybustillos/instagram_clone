// Carregar módulos do express, body-parser e do mongodb
var express = require('express'),
    consign = require('consign'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    multiparty = require('connect-multiparty');

// Instanciar o express
var app = express();

// Instanciar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());
// app.use(expressValidator());
app.use(express.static('./app/public'));
app.use(function(req, res, next) {

    // Habilita requisições cross-domains
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Indica e pré-configura os métodos que a origem pode requisitar
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Habilita que a requisição da origem tenha cabeçalhos reescritos
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
    .include('app/routes')
    .then('config/dbConnection.js')
    .then('app/controllers')
    .then('app/models')
    .into(app);


/* exportar o objeto app */
module.exports = app;