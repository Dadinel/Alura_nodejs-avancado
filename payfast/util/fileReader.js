let fs = require('fs');

let file = 'imagem.jpg';

if(process.argv.lenght > 1) {
    file = process.argv[2];
}

fs.readFile(file, function(error, buffer) {
    if(error) {
        console.log(error);
    }
    else {
        console.log('Arquivo lido.');

        fs.writeFile('new-buffer' + new Date().getTime().toString() + '-' + file, buffer, function(error2) {
            if(error2) {
                console.log(error2);
            }
            else {
                console.log('Novo arquivo salvo.');
            }
        })
    }
});