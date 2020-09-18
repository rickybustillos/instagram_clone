// Importar o banco de dados mongodb
var mongodb = require('mongodb');

// Conexão com o mongodb
var connMongoDB = function(){
    console.log('Conexão estabelecida com o banco de dados');
    var db = new mongodb.Db(
        'instagram',
        new mongodb.Server('localhost', 27017, {}), {}
    );
    return db;
}

module.exports = function(){
    return connMongoDB;
}