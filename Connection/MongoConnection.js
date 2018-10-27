var MongoConnection = function() {
	this.mongodb = require('mongodb');
	this.connectionPromise = null;
};

MongoConnection.prototype.INSERT = 0;
MongoConnection.prototype.DELETE_ONE = 1;
MongoConnection.prototype.DELETE_MANY = 2;
MongoConnection.prototype.UPDATE_ONE = 3;
MongoConnection.prototype.UPDATE_MANY = 4;
MongoConnection.prototype.FIND_ONE = 5;
MongoConnection.prototype.FIND_MANY = 6;

MongoConnection.prototype.connect = function(config) {
	var innerMongodbObject = this.mongodb;

	this.connectionPromise = new Promise(function(resolve, reject) {
		innerMongodbObject.connect(config.connectString, function(err, conn) {
			if(err) {
				reject(err);
			}else {
				resolve(conn.db(config.database));
			}
		});
	});
};

MongoConnection.prototype.execute = function(collection, params, type, sort, 
	limit, callback) {
	var funcName = '';

	switch(type) {
		case this.INSERT:
			if(!Array.isArray(params)) {
				funcName = 'insertMany';
			}else {
				funcName = 'insertOne';
			}
			break;
		case this.DELETE_ONE:
			funcName = 'deleteOne';
			break;
		case this.DELETE_MANY:
			funcName = 'deleteMany';
			break;
		case this.UPDATE_ONE:
			funcName = 'updateOne';
			break;
		case this.UPDATE_MANY:
			funcName = 'updateMany';
			break;
		case this.FIND_ONE:
			funcName = 'findOne';
			break;
		case this.FIND_MANY:
			funcName = 'find';
			break;
		default:
			funcName = 'find';
			break;
	}

	this.connectionPromise.then((conn) => {
		var cb = function(err, res) {
			conn.close();
			callback(err, res);
		};

		conn.collection(collection).deleteOne(params, cb);
	}, (err) => {
		throw err;
	});

	var colQuery = conn.collection(collection);

	if(sort) {
		colQuery = colQuery.sort(sort);
	}

	if(limit) {
		colQuery = colQuery.limit(limit);
	}

	if(type == this.FIND_MANY) {
		colQuery[funcName](params).toArray(cb);
	}else {
		colQuery[funcName](params, cb);
	}
};

// var insertQuery = function(collection, params, callback) {
// 	var cb = function(err, res) {
// 		if(err) {
// 			callback(err);
// 		}

// 		callback(null, res);
// 	};

// 	this.connectionPromise.then((conn) => {
// 		if(!Array.isArray(params)) {
// 			conn.collection(collection).insertMany(params, cb);
// 		}else {
// 			conn.collection(collection).insertOne(params, cb);
// 		}
// 	}, (err) => {
// 		throw err;
// 	})
// };

// var deleteOneQuery = function(collection, params, callback) {
// 	var cb = function(err, res) {
// 		if(err) {
// 			callback(err);
// 		}

// 		callback(null, res);
// 	};

// 	this.connectionPromise.then((conn) => {
// 		conn.collection(collection).deleteOne(params, cb);
// 	}, (err) => {
// 		throw err;
// 	});
// };

module.exports = MongoConnection;