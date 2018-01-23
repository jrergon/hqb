var MysqlConnection = function() {
	this.mysql = require('mysql');
	this.connection = null;
};

MysqlConnection.prototype.initConnection = function(config) {
	if(config.poolAlias) {
		this.connection = this.mysql.createPool(config);
	}else {
		this.connection = this.mysql.createConnection(config);
	}
};

MysqlConnection.prototype.setConnection = function(connection) {
	this.connection = connection;
};

MysqlConnection.prototype.checkConnection = function(callback) {
	this.connection.connect(function(err) {
		if(err) {
			callback(false);
		}else {
			callback(true);
		}
	});
};

MysqlConnection.prototype.getConnection = function() {
	return this.connection;
};

MysqlConnection.prototype.execute = function(sql, params, countSql, callback) {
	var asyncCounter = 1; 
	var counter = 0;
	var returnedData = {};

	if(countSql && countSql != '') {
		returnedData = {
			count: 0, 
			data: []
		};
	}else {
		returnedData = {
			data: []
		};
	}

	if(countSql && countSql != '') {
		asyncCounter = 2;
	}

	var endAsyncCallback = function(err, data, type) {
		if(type == 'data') {
			returnedData.data = data;
		}else {
			returnedData.count = data;
		}

		counter++;
		if(counter == asyncCounter) {
			callback(err, returnedData);
		}
	};
	// -- handle async queries 
	
	// execute query for data
	this.connection.query(sql, params, function(err, data) {
		if(err) {
			endAsyncCallback(err, null);
			return;
		}
		endAsyncCallback(null, data, 'data');
		return;
	});

	if(countSql && countSql != '') {
		// execute query for count
		this.connection.query(countSql, params, function(err, data) {
			if(err) {
				endAsyncCallback(err, null);
				return;
			}
			endAsyncCallback(null, data[0]['CNT'], 'count');
			return;
		});
	}
};

MysqlConnection.prototype.closeConnection = function() {
	this.connection.end();
};

module.exports = MysqlConnection;