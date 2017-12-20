var mysql = require('mysql');

var MysqlConnection = function(){
	this.connection = null;
};

MysqlConnection.prototype.setConnection = function(config){
	this.connection = mysql.createConnection(config).connect(function(err){
		if(err)
			throw err;
	});
};

MysqlConnection.prototype.execute = function(sql, params, cb){
	this.connection.query(sql, params, function(err, data){
		if(err)
			cb(err, null);
		else
			cb(null, data);
	});
};

module.exports = MysqlConnection;