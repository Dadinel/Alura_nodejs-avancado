let mysql = require('mysql');

function createDBConnection() {
    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'payfast'
        });
    }

    if(process.env.NODE_ENV == 'test') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'payfast'
        });
    }

    if(process.env.NODE_ENV == 'production') {
        let urlDeConexao = process.env.CLEARDB_DATABASE_URL;
        let grupos = urlDeConexao.match(/mssql:\/\/(.*):(.*)@(.*)\/(.*)\?/);

        return mysql.createConnection({
                host: grupos[3],
                user: grupos[1],
                password: grupos[2],
                database: grupos[4]
        });
    }    
}

//wrapper
module.exports = function() {
    return createDBConnection;
}