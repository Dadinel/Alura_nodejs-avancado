let restify = require('restify');

let cliente = restify.createJsonClient({
    url: 'http://localhost:3002'
})

let cartao = {};

cliente.post('/cartoes/autoriza', cartao , function(erro, req, res, retorno) {
    console.log('Consumindo servico de cartoes');
    console.log(retorno);
});