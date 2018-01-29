module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisição teste na porta 3001.');
        res.send('OK.');
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        let pagamento = req.body;
        console.log(pagamento);
        res.send('OK.');
    });
}