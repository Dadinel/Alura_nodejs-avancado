let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let morgan = require('morgan');
let logger = require('../servicos/logger.js');

module.exports = function() {
    let app = express();

    app.use(morgan("common", {
        stream: {
            write: function(message) {
                logger.info(message);
            }
        }
    }));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;
}