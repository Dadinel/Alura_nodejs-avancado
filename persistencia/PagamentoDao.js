function PagamentosDao(connection) {
    this._connection = connection;
}

PagamentosDao.prototype.lista = function(callback) {
    this._connection.query('select * from pagamentos', callback);
}

PagamentosDao.prototype.salva = function(produto, callback) {
    this._connection.query('insert into pagamentos set ?', produto, callback);
}

PagamentosDao.prototype.buscaPorId = function(id, callback) {
    this._connection.query('delete from pagamentos where id = ?', id, callback);
}

PagamentosDao.prototype.deleta = function(id, callback) {
    this._connection.query('delete from pagamentos where ?', id, callback);
}

module.exports = function() {
    return PagamentosDao;
}