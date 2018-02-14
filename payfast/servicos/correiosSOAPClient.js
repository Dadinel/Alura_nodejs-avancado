let soap = require('soap');

function CorreiosSOAPClient() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPClient.prototype.calculaPrazo = function(args, callback) {
    soap.createClient(this._url, function(error, client) {
        if(error) {
            console.log(error);
        }
        else {
            /*let prazo = {"nCdServico":"40010", "sCepOrigem":"04101300", "sCepDestino":"65000600"};
    
            client.CalcPrazo(prazo , function(erro, result) {
                if(erro) {
                    console.log(erro);
                }
                else {
                    console.log(JSON.stringify(result));
                }
            });*/
    
            client.CalcPrazo(args , callback);
        }
    });
}

module.exports = function() {
    return CorreiosSOAPClient;
}