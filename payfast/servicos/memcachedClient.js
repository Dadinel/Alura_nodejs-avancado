let memcahed = require('memcached');

function createMemcachedClient() {
    let client = new memcahed('localhost:11211', {
        retries: 2,
        retry: 1500,
        remove: true
    });

    return client;
}

module.exports = function() {
    return createMemcachedClient;
}

/*client.set('pagamento-20', {"id":20}, 60000, function(error) {
    if(error) {
        console.log(error);
    }
    else {
        console.log('Nova chave adicionada ao cache.');
    }
});

client.get('pagamento-20', function(error, retorno) {
    if(error || !retorno) {
        console.log('MISS - chave não encontrada.');
    }
    else {
        console.log('HIT - valor:' + JSON.stringify(retorno));
    }
});*/