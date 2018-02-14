var app = require('./config/custom-express')();

app.listen(3002, function(){
  console.log('Servidor de cartoes rodando na porta 3002.');
});
