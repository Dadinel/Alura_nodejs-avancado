module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisição teste na porta 3001.');
        res.send('OK.');
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        let pagamento = req.body;

        console.log('Processando uma requisição de um novo pagamento');
        pagamento.status = 'CRIADO';
        pagamento.data = new Date();

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function(erro, resultado) {
            if(erro) {
                console.log(erro);
            }
            else {
                console.log('Pagamento criado');
                console.log(resultado);
                res.json(pagamento);
            }
        })

        //res.send(pagamento);
    });
}