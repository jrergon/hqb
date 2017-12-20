var oracle = require('oracledb');

oracle.outFormat = oracle.OBJECT;
oracle.autoCommit = true;
oracle.fetchArraySize = 100000;

var OracleConnection = function(){
	this.connectionPromise = null;
};

OracleConnection.prototype.initConnection = function(config){
	if(config.poolAlias){
		this.connectionPromise = new Promise(function(resolve, reject){
			oracle.createPool(config, function(err, pool){
				if(err){
					var defaultPool = oracle.getPool(config.poolAlias);
					defaultPool.getConnection(function(err, conn){
						if(err)
							reject(err);
						else
							resolve(conn);
					})
				}else{
					pool.getConnection(function(err, conn){
						if(err)
							reject(err);
						else
							resolve(conn);
					});
				}
			});
		});
	}else{
		this.connectionPromise = new Promise(function(resolve,reject){
			oracle.getConnection(config, function(err, conn){
				if(err)
					reject(err);
				else
					resolve(conn);
			});
		});
	}
};

OracleConnection.prototype.setConnection = function(connectionPromise){
	this.connectionPromise = connectionPromise;
};

OracleConnection.prototype.getConnection = function(){
	return this.connectionPromise;
};

OracleConnection.prototype.execute = function(sql, params, countSql, callback){
	this.connectionPromise.then((conn)=>{
		// handle async queries		
		var asyncCounter = 1; 
		var counter = 0;
		var asyncEnd = false;

		if(countSql && countSql != "")
			var returnedData = {count: 0, data:[]};
		else
			var returnedData = {data:[]};
		if(countSql && countSql != "")
			asyncCounter = 2;

		var endAsyncCallback = function(err, data, type){
			if(type == "data")
				returnedData.data = data;
			else
				returnedData.count = data;

			counter++;
			if(counter == asyncCounter){
				conn.close(function(err){
					if(err)
						console.log(err.message);
				});

				callback(err, returnedData);
			}
		};
		// -- handle async queries 
		
		// execute query for data
		conn.execute(sql, params, function(err, data){
			if(err){
				endAsyncCallback(err, null);
				return;
			}
			
			endAsyncCallback(null, data.rows, "data");
			return;
		});

		if(countSql && countSql != ""){
			// execute query for count
			conn.execute(countSql, params, function(err, data){
				if(err){
					endAsyncCallback(err, null);
					return;
				}
				
				endAsyncCallback(null, data.rows[0]["CNT"], "count");
				return;
			});
		}
	}, (err) =>{
		throw err.message;
	});
};

OracleConnection.prototype.getServerVersion = function(cb){
	this.connectionPromise.then((conn) => {
		cb(conn.oracleServerVersion);
	}, (err) => {
		cb(0);
	});
};

OracleConnection.prototype.setAutoCommit = function(status){
	oracle.autoCommit = status;
};

OracleConnection.prototype.setFetchMode = function(mode){
	switch(mode){
		case "OBJECT":
			oracle.outFormat = oracle.OBJECT;
			break;
		case "ARRAY":
			oracle.outFormat = oracle.ARRAY;
			break;
	}
};

OracleConnection.prototype.setFetchSize = function(size){
	oracle.fetchArraySize = size;
};

OracleConnection.prototype.commit = function(){
	this.connectionPromise.then((conn) => {
		conn.commit(function(err){
			if(err)
				console.log(err);
			conn.close(function(err){
				if(err)
					console.log(err);
				oracle.setAutoCommit(true);
			});
		});
	}, (err) => {
		return 0;
	});
};

OracleConnection.prototype.rollback = function(){
	this.connectionPromise.then((conn) => {
		conn.rollback(function(err){
			if(err)
				console.log(err);
			conn.close(function(err){
				if(err)
					console.log(err);
				oracle.setAutoCommit(true);
			});
		});
	}, (err) => {
		return 0;
	});
};

module.exports = OracleConnection;