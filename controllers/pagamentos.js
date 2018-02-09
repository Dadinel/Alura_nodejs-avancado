module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        /*console.log('Recebida requisição teste na porta 3001.');
        res.send('OK.');*/

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.lista(function(exception, result) {
            if(exception) {
                res.status(500).send(exception);
            }
            else {
                res.json(result);
            }
        });
    });

    app.delete('/pagamentos/pagamento/:id', function(req, res) {
        let id = req.params.id;
        let pagamento = {};

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(error, result) {
            if(error) {
                res.status(500).send(error);
            }
            else {
                res.status(204).send(pagamento);
            }
        });
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {
        let id = req.params.id;
        let pagamento = {};

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(error, result) {
            if(error) {
                res.status(500).send(error);
            }
            else {
                res.send(pagamento);
            }
        });
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        req.assert('forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
        req.assert('valor', 'Valor é obrigatório e deve ser decimal').notEmpty().isFloat();
        req.assert('moeda', 'Moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3,3);

        let erros = req.validationErrors();

        if(erros) {
            console.log('Erros de validação encontrados:' + erros);
            res.status(400).send(erros);
        }
        else {
            let pagamento = req.body;

            console.log('Processando uma requisição de um novo pagamento');
            pagamento.status = 'CRIADO';
            pagamento.data = new Date();

            let connection = app.persistencia.connectionFactory();
            let pagamentoDao = new app.persistencia.PagamentoDao(connection);

            pagamentoDao.salva(pagamento, function(exception, result) {
                if(exception) {
                    console.log('Erro ao inserir no banco:' + exception);
                    res.status(500).send(exception);
                }
                else {
                    pagamento.id = result.insertId;
                    console.log('Pagamento criado:' + pagamento);
                    res.location('/pagamentos/pagamento/' + pagamento.id);

                    let response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href: "http://localhost:3001/pagamentos/pagamento/" + pagamento.id,
                                rel: "confirmar",
                                method: "PUT"
                            },
                            {
                                href: "http://localhost:3001/pagamentos/pagamento/" + pagamento.id,
                                rel: "cancelar",
                                method: "DELETE"
                            }
                        ]
                    };

                    res.status(201).json(response);
                    //res.status(201).json(pagamento);
                }
            })
        }
        //res.send(pagamento);
    });
}