/* importar as configurações do servidor */
var app = require('./config/server');

// Configurar porta
var port = 8080;

/* parametrizar a porta de escuta */
app.listen(port, function(){
	console.log('Servidor API escutando na porta '+port);
})