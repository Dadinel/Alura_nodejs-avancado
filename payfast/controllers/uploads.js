let fs = require('fs');

module.exports = function(app) {
    app.post('/upload/imagem', function(req, res) {
        let filename = '';

        if(req.headers.filename) {
            filename = req.headers.filename;
        }
        else {
            filename = 'file' + new Date().getTime().toString();
        }

        req
            .pipe(fs.createWriteStream('files/' + filename))
            .on('finish', function() {
                res.status(201).send('OK');
            })
    });
}