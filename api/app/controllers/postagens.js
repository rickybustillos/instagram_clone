var objectId = require('mongodb').ObjectID;
var fs = require('fs');

module.exports.get = (app, req, res) => {

    var connection = app.config.dbConnection;

    var PostagensDAO = new app.app.models.PostagensDAO(connection);

    PostagensDAO.get(res);

}

module.exports.getImagem = (app, req, res) => {

    var img = req.params.imagem;
    fs.readFile('./uploads/' + img, (err, content) => {
        if (err) {
            res.status(400).json(err);
            return;
        }
        // res.writeHead(200, { 'content-type' : 'image/jpg' });
        res.end(content);
    });

}

module.exports.create = (app, req, res) => {

    // Instancia o objeto Date
    var date = new Date();

    // Recebe o tempo atual em ms
    var time_stamp = date.getTime();

    // Recebe data atual
    var data_atual = date.toLocaleString();

    // Recebendo dados enviados via POST
    var dados = req.body;

    // res.send(dados);

    // Gerando um nome único para o arquivo da imagem
    var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;

    // Setando informações para renomear e mover
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
            data_criacao: data_atual,
            url_imagem: url_imagem,
            descricao: req.body.descricao
        }

        var connection = app.config.dbConnection;
        var PostagensDAO = new app.app.models.PostagensDAO(connection);

        PostagensDAO.create(res, dados);

    });
}

module.exports.createComentario = (app, req, res) => {

    var comentario = req.body.comentario;

    // Remove whitespaces
    comentario = comentario.trim();

    // Verificar se existe string
    if (comentario == '') {
        res.status(400).json({ msg: 'Comentário inválido.' });
        return;
    }
    
    // Recebe data atual
    var data_atual = new Date().toLocaleString();

    // Cria um ID único para o comentário
    var id_comentario = new objectId();

    // Recebe o ID da postagem
    var id_postagem = req.params.id;

    // Seta os dados a serem enviados para o model
    var dados = {
        id_comentario: id_comentario,
        id_postagem: id_postagem,
        comentario: comentario,
        data_criacao: data_atual
    }

    var connection = app.config.dbConnection;
    var PostagensDAO = new app.app.models.PostagensDAO(connection);

    PostagensDAO.createComentario(res, dados);
    
}

module.exports.deleteComentario = (app, req, res) => {

        var id_comentario = req.params.id;

        var dados = {
            id_comentario: id_comentario
        }
    
        var connection = app.config.dbConnection;
        var PostagensDAO = new app.app.models.PostagensDAO(connection);
    
        PostagensDAO.deleteComentario(res, dados);
    
}