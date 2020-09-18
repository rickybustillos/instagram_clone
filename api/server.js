// Carregar módulos do express, body-parser e do mongodb
var express = require('express'),
    expressValidator = require('express-validator'),
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

    var date = new Date();
    time_stamp = date.getTime();

    // Recebendo dados enviados via POST
    var dados = req.body;

    res.send(dados);

    var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;

    var path_origem = req.files.arquivo.path;
    var path_destino = './uploads/' + url_imagem;

    var readS = fs.createReadStream(path_origem);
    var writeS = fs.createWriteStream(path_destino);
    readS.pipe(writeS);

    readS.on("end", function(err) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        var dados = {
            url_imagem: url_imagem,
            descricao: req.body.descricao
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

app.get('/imagens/:imagem', function(req, res) {

    var img = req.params.imagem;

    fs.readFile('./uploads/' + img, function(err, content) {
        if (err) {
            res.status(400).json(err);
            return;
        }

        // res.writeHead(200, { 'content-type' : 'image/jpg' });
        res.end(content);

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

    var comentario = req.body.comentario;

    // Remove whitespaces
    comentario = comentario.trim();

    // Verificar se existe string
    if(comentario == ''){
        res.status(400).json({ msg: 'Comentário inválido.'});
        return;
    }

    var id_comentario = new objectId();
    
    db.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.update(
                { _id: objectId(req.params.id) },
                { $push:    { 
                                comentarios : {
                                    id_comentario : id_comentario,
                                    comentario : comentario
                                }
                            }
                },
                {},
                function(err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.status(200).json({resultados : records, id_publicacao : req.params.id, id_comentario : id_comentario, comentario : comentario});
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
            collection.update( 
                {},
                { $pull : { comentarios: { id_comentario : objectId(req.params.id) } } },
                { multi:true },
                function(err, records) {
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