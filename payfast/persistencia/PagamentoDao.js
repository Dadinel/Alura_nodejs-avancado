function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.salva = function(pagamento,callback) {
    this._connection.query('insert into pagamentos SET ?', pagamento, callback);
}

PagamentoDao.prototype.atualiza = function(pagamento,callback) {
    this._connection.query('update pagamentos SET status = ? where id = ? and status <> ?', [pagamento.status, pagamento.id, 'CANCELADO'] , callback);
}

PagamentoDao.prototype.lista = function(callback) {
    this._connection.query('select * from pagamentos where status <> ?' , ['CANCELADO'] , callback );
}

PagamentoDao.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from pagamentos where id = ?",[id],callback);
}

PagamentoDao.prototype.deleta = function (id,callback) {
    this._connection.query("delete from pagamentos where id = ?",[id],callback);
}

module.exports = function(){
    return PagamentoDao;
};