let winston = require('winston');
let fs = require('fs');

if(!fs.existsSync('logs')) {
    fs.mkdir('logs');
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxsize: 100000,
            maxFiles: 10
        })
    ]
});

/*logger.log('info' , 'Log utilizando o winston e info.');
logger.info('Log com chamada via level informado na transports.');*/