var OracleConnection = function() {
	this.oracle = require('oracledb');

	this.oracle.outFormat = this.oracle.OBJECT;
	this.oracle.autoCommit = true;
	this.oracle.fetchArraySize = 100000;

	this.connectionPromise = null;
};

OracleConnection.prototype.initConnection = function(config) {
	var innerOracleObject = this.oracle;
	
	if(config.poolAlias) {
		this.connectionPromise = new Promise(function(resolve, reject) {
			innerOracleObject.createPool(config, function(err, pool) {
				if(err) {
					var defaultPool = 
						innerOracleObject.getPool(config.poolAlias);
					defaultPool.getConnection(function(err, conn) {
						if(err) {
							reject(err);
						}else {
							resolve(conn);
						}
					});
				}else{
					pool.getConnection(function(err, conn) {
						if(err) {
							reject(err);
						}else {
							resolve(conn);
						}
					});
				}
			});
		});
	}else{
		this.connectionPromise = new Promise(function(resolve, reject) {
			innerOracleObject.getConnection(config, function(err, conn) {
				if(err) {
					reject(err);
				}else {
					resolve(conn);
				}
			});
		});
	}
};

OracleConnection.prototype.setConnection = function(connectionPromise) {
	this.connectionPromise = connectionPromise;
};

OracleConnection.prototype.getConnection = function() {
	return this.connectionPromise;
};

OracleConnection.prototype.execute = function(sql, params, countSql, callback) {
	this.connectionPromise.then((conn)=>{
		// handle async queries		
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
		conn.execute(sql, params, function(err, data) {
			if(err) {
				endAsyncCallback(err, null);
				return;
			}
			
			endAsyncCallback(null, data.rows, 'data');
			return;
		});

		if(countSql && countSql != '') {
			// execute query for count
			conn.execute(countSql, params, function(err, data) {
				if(err) {
					endAsyncCallback(err, null);
					return;
				}
				endAsyncCallback(null, data.rows[0]['CNT'], 'count');
				return;
			});
		}
	}, (err) =>{
		throw err;
	});
};

OracleConnection.prototype.getServerVersion = function(cb) {
	this.connectionPromise.then((conn) => {
		cb(conn.oracleServerVersion);
	}, (error) => {
		cb(0);
	});
};

OracleConnection.prototype.setAutoCommit = function(status) {
	this.oracle.autoCommit = status;
};

OracleConnection.prototype.setFetchMode = function(mode) {
	switch(mode) {
		case 'OBJECT':
			this.oracle.outFormat = this.oracle.OBJECT;
			break;
		case 'ARRAY':
			this.oracle.outFormat = this.oracle.ARRAY;
			break;
	}
};

OracleConnection.prototype.setFetchSize = function(size) {
	this.oracle.fetchArraySize = size;
};

OracleConnection.prototype.commit = function() {
	this.connectionPromise.then((conn) => {
		conn.commit(function(err) {
			if(err) {
				console.log(err);
			}
			this.oracle.setAutoCommit(true);
		});
	}, (error) => {
		return 0;
	});
};

OracleConnection.prototype.rollback = function() {
	this.connectionPromise.then((conn) => {
		conn.rollback(function(err) {
			if(err) {
				console.log(err);
			}

			this.oracle.setAutoCommit(true);
		});
	}, (error) => {
		return 0;
	});
};

OracleConnection.prototype.closeConnection = function() {
	this.connectionPromise.then((conn) => {
		conn.close(function(err) {
			if(err) {
				console.log(err.message);
			}
		});		
	}, (error) => {
		console.log(error);
	});
};

module.exports = OracleConnection;