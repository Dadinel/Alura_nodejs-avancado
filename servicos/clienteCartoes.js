let restify = require('restify');

let cliente = restify.createJsonClient({
    url: 'http://localhost:3002'
})

cliente.post('/cartoes/autoriza', function(erro, req, res, retorno) {
    console.log('Consumindo servico de cartoes');
    console.log(retorno);
});