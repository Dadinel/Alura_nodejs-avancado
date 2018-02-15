module.exports = function(app) {

    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";

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

    app.get('/pagamentos/pagamento/:id', function(req, res) {
        let id = req.params.id;

        console.log('Consultando o pagamento: ' + id);

        let memcachedClient = app.servicos.memcachedClient();

        memcachedClient.get('pagamento-' + id, function(error, retorno) {
            if(error || !retorno) {
                console.log('MISS - chave nao encontrada.');

                let connection = app.persistencia.connectionFactory();
                let pagamentoDao = new app.persistencia.PagamentoDao(connection);
        
                pagamentoDao.buscaPorId(id, function(exception, result) {
                    if(exception) {
                        console.log(exception);
                        res.status(500).send(exception);
                    }
                    else {
                        res.json(result);
                    }
                });
            }
            else {
                console.log('HIT - valor: ' + JSON.stringify(retorno));
                res.json(retorno);
            }
        });
    });

    app.delete('/pagamentos/pagamento/:id', function(req, res) {
        let id = req.params.id;
        let pagamento = {};

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(error, result) {
            if(error) {
                console.log(error);
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
        pagamento.status = PAGAMENTO_CONFIRMADO;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(error, result) {
            if(error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                res.send(pagamento);
            }
        });
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        req.assert('pagamento.forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
        req.assert('pagamento.valor', 'Valor é obrigatório e deve ser decimal').notEmpty().isFloat();
        req.assert('pagamento.moeda', 'Moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3,3);

        let erros = req.validationErrors();

        if(erros) {
            console.log('Erros de validação encontrados:' + erros);
            res.status(400).send(erros);
        }
        else {
            let pagamento = req.body['pagamento'];

            console.log('Processando uma requisição de um novo pagamento');
            pagamento.status = PAGAMENTO_CRIADO;
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

                    let memcachedClient = app.servicos.memcachedClient();

                    memcachedClient.set('pagamento-' + pagamento.id, pagamento, 60000, function(error) {
                        if(error) {
                            console.log(error);
                        }
                        else {
                            console.log('Nova chave adicionada ao cache: pagamento-' + pagamento.id );
                        }
                    });

                    if(pagamento.forma_de_pagamento == 'cartao') {
                        let cartao = req.body['cartao'];
                        console.log(cartao);

                        let clienteCartoes = new app.servicos.clienteCartoes();

                        clienteCartoes.autoriza(cartao, function(exceptionC, reqC, resC, retornoC) {
                            if(exceptionC) {
                                let returnStatus = 400;

                                if(exceptionC.statusCode) {
                                    returnStatus = exceptionC.statusCode
                                }

                                console.log(exceptionC);
                                res.status(returnStatus).send(exceptionC);
                            }
                            else {
                                console.log(retornoC);

                                res.location('/pagamentos/pagamento/' + pagamento.id);

                                let response = {
                                    dados_do_pagamento: pagamento,
                                    cartao: retornoC,
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
                            }
                        });
                    }
                    else {
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
                }
            })
        }
        //res.send(pagamento);
    });
}