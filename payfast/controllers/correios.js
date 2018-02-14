module.exports = function(app) {
    app.post('/correios/calculo-prazo', function(req, res) {
        let dadosDaEntrega = req.body;

        let correiosSOAPClient = new app.servicos.correiosSOAPClient();

        correiosSOAPClient.calculaPrazo(dadosDaEntrega, function(error, result) {
            if(error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                //res.status(200).send(result);
                res.json(result);
            }
        });
    });
}