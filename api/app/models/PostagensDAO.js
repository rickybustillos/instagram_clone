var objectId = require('mongodb').ObjectID;

function PostagensDAO(connection) {
    this._connection = connection();
}

PostagensDAO.prototype.get = function(res) {
    this._connection.open(function(err, mongoclient) {
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
}

PostagensDAO.prototype.create = function(res, dados) {
    this._connection.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.insert(dados, function(err, records) {

                if (err) {
                    res.json(err);
                } else {
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
}

PostagensDAO.prototype.createComentario = function(res, dados) {
    this._connection.open(function(err, mongoclient) {
        mongoclient.collection('postagens', (err, collection) => {
            collection.update({ _id: objectId(dados.id_postagem) }, {
                    $push: {
                        comentarios: {
                            id_comentario: dados.id_comentario,
                            comentario: dados.comentario
                        }
                    }
                },
                function(err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.status(200).json({
                            resultados: records,
                            id_postagem: dados.id_postagem,
                            id_comentario: dados.id_comentario,
                            comentario: dados.comentario,
                            data_criacao: dados.data_criacao
                        });
                    }
                    mongoclient.close();
                }
            );
        });
    });
}

PostagensDAO.prototype.deleteComentario = function(res, dados) {
    this._connection.open(function(err, mongoclient) {
        mongoclient.collection('postagens', function(err, collection) {
            collection.update({}, { $pull: { comentarios: { id_comentario: objectId(dados.id_comentario) } } }, { multi: true },
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
}
module.exports = function() {
    return PostagensDAO;
}