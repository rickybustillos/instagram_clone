module.exports = function(app) {
    app.get('/api/postagens', function(req, res) {
        app.app.controllers.postagens.get(app, req, res);
    });
    app.post('/api/postagens', function(req, res) {
        app.app.controllers.postagens.create(app, req, res);
    });
    app.put('/api/postagens', function(req, res) {
        app.app.controllers.postagens.update(app, req, res);
    });
    app.delete('/api/postagens', function(req, res) {
        app.app.controllers.postagens.delete(app, req, res);
    });

    app.get('/api/postagens/imagens/:imagem', function(req, res) {
        app.app.controllers.postagens.getImagem(app, req, res);
    });

    app.put('/api/postagens/comentarios/:id', function(req, res) {
        app.app.controllers.postagens.createComentario(app, req, res);
    });

    app.delete('/api/postagens/comentarios/:id', function(req, res) {
        app.app.controllers.postagens.deleteComentario(app, req, res);
    });

}