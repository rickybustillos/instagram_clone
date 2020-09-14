// Carregar módulos do express, body-parser e do mongodb
var express = require('express'),
    bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty'),
    mongodb = require('mongodb'),
    objectId = require('mongodb').ObjectId,
    fs = require('fs');

// Instanciar o express
var app = express();

// Instanciar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());

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

    // aplicação cross-domain, responde a qualquer domínio
    res.setHeader('Access-Control-Allow-Origin', '*');

    var date = new Date();
    time_stamp = date.getTime();

    // Recebendo dados enviados via POST
    var dados = req.body;

    res.send(dados);

    console.log(req.files);

    var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;

    var path_origem = req.files.arquivo.path;
    var path_destino = './uploads/' + url_imagem;
    

    var readS = fs.createReadStream(path_origem);
    var writeS = fs.createWriteStream(path_destino);
    readS.pipe(writeS);

    readS.on("end", function(err) {
        if(err){
        res.status(500).json({ error : err });
        return;
        }
        
        var dados = {
            url_imagem: url_imagem,
            titulo: req.body.titulo
        }
        
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

});


// GET (read)
app.get('/api', function(req, res) {
    db.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.find().toArray(function(err, results) {
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


// GET by ID (read)
app.get('/api/:id', function(req, res) {
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


// PUT by ID (update)
app.put('/api/:id', function(req, res) {
    db.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.update({ _id: objectId(req.params.id) }, { $set: { titulo: req.body.titulo } }, {},
                function(err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(records);
                    }
                    mongoclient.close();
                }
            );
        });
    });

});

// DELETE by ID (remover)
app.delete('/api/:id', function(req, res) {
    db.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.remove({ _id: objectId(req.params.id) }, function(err, records) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
});