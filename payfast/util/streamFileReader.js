let fs = require('fs');

let file = 'imagem.jpg';

if(process.argv.lenght > 1) {
    file = process.argv[2];
}

fs.createReadStream(file)
    .pipe(fs.createWriteStream('new-stream-' + new Date().getTime().toString() + '-' + file))
    .on('finish', function() {
        console.log('Arquivo escrito com stream.');
    });