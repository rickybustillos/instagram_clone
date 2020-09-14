// Carregar módulos do express, body-parser e do mongodb
var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb');
    objectId = require('mongodb').ObjectId;

// Instanciar o express
var app = express();

// Instanciar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar porta
var port = 8080;
app.listen(port);

// Conexão com o mongodb
var db = mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}), {}
);


console.log('Servidor HTTP está escutando na porta ' + port);

app.get('/', function(req, res) {
    res.send({ msg: 'Olá' });
});

// API RESTful

// POST (create)
app.post('/api', function(req, res) {

    // Recebendo dados enviados via POST
    var dados = req.body;

    db.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.insert(dados, function(err, records) {

                if (err) {
                    res.json(err);
                } else {
                    res.json(records);
                }
                mongoclient.close();
            });
        })
    });

});

// GET by ID (read)
app.get('/api/:id', function(req, res) {

    // Recebendo dados enviados via POST
    var dados = req.body;

    db.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.find(objectId(req.params.id)).toArray(function(err, results) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });

});