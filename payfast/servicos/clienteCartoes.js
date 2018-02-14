//let restify = require('restify');
let restify = require('restify-clients');

function CartoesClient() {
    this._cliente = restify.createJsonClient({
        url: 'http://localhost:3002'
    })
}

CartoesClient.prototype.autoriza = function(cartao, callback) {
    /*this._cliente.post('/cartoes/autoriza', cartao , function(erro, req, res, retorno) {
        console.log('Consumindo servico de cartoes');
        console.log(retorno);
    });*/
    this._cliente.post('/cartoes/autoriza', cartao, callback);
}

module.exports = function() {
    return CartoesClient;
}