var MysqlConnection = require('./Connection/MysqlConnection.js');
var OracleConnection = require('./Connection/OracleConnection.js');
var QueryBuilder = require('./QueryBuilder.js');

// constuctor for query builder
var Hqb = function(){
	this.db = null;
	this.queryString = null;
	this.queryParameters = {};
	this.dbConfig = {};
};

Hqb.prototype.initConnection = function(config){
	this.dbConfig = config;
	switch(config.type.toUpperCase()){
		case "MYSQL":
			this.db = new MysqlConnection();
			this.db.initConnection(config);
			break;
		case "ORACLE":
			this.db = new OracleConnection();
			this.db.initConnection(config);
			break;
		default:
			this.db = new OracleConnection();
			this.db.initConnection(config);
			break;
	}
};

Hqb.prototype.setConnection = function(type, connectionPromise){
	this.dbConfig.type = type;
	switch(type.toUpperCase()){
		case "MYSQL":
			this.db = new MysqlConnection();
			this.db.setConnection(connectionPromise);
			break;
		case "ORACLE":
			this.db = new OracleConnection();
			this.db.setConnection(connectionPromise);
			break;
		default:
			this.db = new OracleConnection();
			this.db.setConnection(connectionPromise);
			break;
	}
};	

Hqb.prototype.createQueryBuilder = function(){
	return new QueryBuilder(this.dbConfig.type, this.db);
};

// Set auto commit status, boolean - Default TRUE
Hqb.prototype.setAutoCommit = function(status){
	this.db.setAutoCommit(status);
};

// Set fetch mode, 'OBJECT' or 'ARRAY' - Default OBJECT
Hqb.prototype.setFetchMode = function(mode){
	this.db.setFetchMode(mode);
};

// Set fetch size, integer - Default 100000
Hqb.prototype.setFetchSize = function(size){
	this.db.setFetchSize(size);
};

Hqb.prototype.beginTransaction = function(){
	this.db.setAutoCommit(false);
};

Hqb.prototype.commit = function(){
	this.db.commit();
};

Hqb.prototype.rollback = function(){
	this.db.rollback();
};

module.exports = Hqb;