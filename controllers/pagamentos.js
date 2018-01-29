module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisição teste na porta 3001.');
        res.send('OK.');
    });
}