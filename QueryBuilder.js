var OracleQueryCreator = require('./Query/OracleQueryCreator.js');
var MysqlQueryCreator = require('./Query/MysqlQueryCreator.js');

var QueryBuilder = function(databaseType, serverVersion, db) {
	this.queryObject = {};
	this.queryString = '';
	this.queryParameters = {};
	this.databaseType = databaseType;
	this.serverVersion = serverVersion;
	this.db = db;
};

/*
This function adds items to select ( parameter can be both array and string )
WARNING: This function overrides previous calls to select
*/
QueryBuilder.prototype.select = function(columns) {
	this.queryObject.select = [];

	if(Array.isArray(columns)) {
		this.queryObject.select = columns;
	}else if(typeof columns === 'string') {
		this.queryObject.select.push(columns);
	}else {
		throw 'Unsupported type for \'select\' function.';
	}

	return this;
};

/*
This function adds items to select ( parameter can be both array and string )
 */
QueryBuilder.prototype.addSelect = function(columns) {
	if(!Array.isArray(this.queryObject.select)) {
		this.queryObject.select = [];
	}

	if(Array.isArray(columns)) {
		this.queryObject.select.concat(columns);
	}else if(typeof columns === 'string') {
		this.queryObject.select.push(columns);
	}else {
		throw 'Unsupported type for \'select\' function.';
	}

	return this;
};

/*
This function sets table name for 'from' 
 */
QueryBuilder.prototype.from = function(tableName, alias = null) {
	if(typeof tableName !== 'string') {
		throw 'Unsupported type for \'from\' function.';
	}
	if(alias && typeof alias !== 'string') {
		throw 'Unsupported type for \'from\' function.';
	}

	this.queryObject.from = {
		'tableName': tableName, 
		'alias': alias
	};

	return this;
};

/*
This function adds items to where ( parameter can be both array and string )
WARNING: This function overrides all previously set conditions
 */
QueryBuilder.prototype.where = function(filters) {
	this.queryObject.where = [];

	if(Array.isArray(filters)) {
		for(var i = 0; i < filters.length; i++) {
			var obj = {
				'condition': 'AND',
				'filter': filters[i]
			};

			this.queryObject.where.push(obj);
		}
	}else if(typeof filters === 'string') {
		this.queryObject.where.push({
			'condition': 'AND',
			'filter': filters
		});
	}else {
		throw 'Unsupported type for \'where\' function.';
	}

	return this;
};

/*
This function adds items to where ( parameter can be both array and string )
 */
QueryBuilder.prototype.andWhere = function(filters) {
	if(!Array.isArray(this.queryObject.where)) {
		this.queryObject.where = [];
	}

	if(Array.isArray(filters)) {
		for(var i = 0; i < filters.length; i++) {
			var obj = {
				'condition': 'AND',
				'filter': filters[i]
			};

			this.queryObject.where.push(obj);
		}
	}else if(typeof filters === 'string') {
		this.queryObject.where.push({
			'condition': 'AND',
			'filter': filters
		});
	}else {
		throw 'Unsupported type for \'where\' function.';
	}

	return this;
};

/*
This function adds items to where ( parameter can be both array and string )
 */
QueryBuilder.prototype.orWhere = function(filters) {
	if(!Array.isArray(this.queryObject.where)) {
		this.queryObject.where = [];
	}

	if(Array.isArray(filters)) {
		for(var i = 0; i < filters.length; i++) {
			var obj = {
				'condition': 'OR',
				'filter': filters[i]
			};

			this.queryObject.where.push(obj);
		}
	}else if(typeof filters === 'string') {
		this.queryObject.where.push({
			'condition': 'OR',
			'filter': filters
		});
	}else {
		throw 'Unsupported type for \'where\' function.';
	}

	return this;
};

/*
This function adds join statements
 */
QueryBuilder.prototype.join = function(tableName, alias, conditions = null) {
	if(typeof tableName !== 'string') {
		throw 'Unsupported type for \'join\' function.';
	}
	
	if(typeof alias !== 'string') {
		throw 'Unsupported type for \'join\' function.';
	}
	
	if(conditions && typeof conditions !== 'string') {
		throw 'Unsupported type for \'join\' function.';
	}

	if(!Array.isArray(this.queryObject.join)) {
		this.queryObject.join = [];
	}

	this.queryObject.join.push({
		'type': 'INNER',
		'tableName': tableName,
		'alias': alias,
		'conditions': conditions
	});

	return this;
};

/*
This function adds left join statements
 */
QueryBuilder.prototype.leftJoin = function(tableName, 
	alias, conditions = null) {
	if(typeof tableName !== 'string') {
		throw 'Unsupported type for \'leftJoin\' function.';
	}

	if(typeof alias !== 'string') {
		throw 'Unsupported type for \'leftJoin\' function.';
	}

	if(conditions && typeof conditions !== 'string') {
		throw 'Unsupported type for \'leftJoin\' function.';
	}

	if(!Array.isArray(this.queryObject.join)) {
		this.queryObject.join = [];
	}

	this.queryObject.join.push({
		'type': 'LEFT',
		'tableName': tableName,
		'alias': alias,
		'conditions': conditions
	});

	return this;
};

/*
This function adds right join statements
 */
QueryBuilder.prototype.rightJoin = function(tableName, 
	alias, conditions = null) {
	if(typeof tableName !== 'string') {
		throw 'Unsupported type for \'rightJoin\' function.';
	}

	if(typeof alias !== 'string') {
		throw 'Unsupported type for \'rightJoin\' function.';
	}

	if(conditions && typeof conditions !== 'string') {
		throw 'Unsupported type for \'rightJoin\' function.';
	}

	if(!Array.isArray(this.queryObject.join)) {
		this.queryObject.join = [];
	}

	this.queryObject.join.push({
		'type': 'RIGHT',
		'tableName': tableName,
		'alias': alias,
		'conditions': conditions
	});

	return this;
};

/*
This function adds ordering condition
WARNING: this function overrides all previously set ordering conditions
 */
QueryBuilder.prototype.orderBy = function(column, direction = null) {
	if(typeof column !== 'string') {
		throw 'Unsupported type for \'orderBy\' function.';
	}

	if(direction && typeof direction !== 'string') {
		throw 'Unsupported type for \'orderBy\' function.';
	}

	this.queryObject.orderBy = [];

	this.queryObject.orderBy.push({
		'column': column,
		'direction': direction
	});

	return this;
};

/*
This function adds ordering condition
 */
QueryBuilder.prototype.addOrderBy = function(column, direction = null) {
	if(typeof column !== 'string') {
		throw 'Unsupported type for \'orderBy\' function.';
	}

	if(direction && typeof direction !== 'string') {
		throw 'Unsupported type for \'orderBy\' function.';
	}

	if(!Array.isArray(this.queryObject.orderBy)) {
		this.queryObject.orderBy = [];
	}

	this.queryObject.orderBy.push({
		'column': column,
		'direction': direction
	});

	return this;
};

/*
This function adds grouping condition
WARNING: This function overrides all previously set grouping conditions
 */
QueryBuilder.prototype.groupBy = function(column) {
	if(typeof column !== 'string') {
		throw 'Unsupported type for \'groupBy\' function.';
	}

	this.queryObject.groupBy = [];

	this.queryObject.groupBy.push(column);

	return this;
};

/*
This function adds grouping condition
 */
QueryBuilder.prototype.addGroupBy = function(column) {
	if(typeof column !== 'string') {
		throw 'Unsupported type for \'groupBy\' function.';
	}

	if(!Array.isArray(this.queryObject.groupBy)) {
		this.queryObject.groupBy = [];
	}

	this.queryObject.groupBy.push(column);

	return this;
};

/*
This function adds having conditions
WARNING: This function overrides all previously set having conditions
 */
QueryBuilder.prototype.having = function(filters) {
	this.queryObject.having = [];

	if(Array.isArray(filters)) {
		for(var i = 0; i < filters.length; i++) {
			var obj = {
				'condition': 'AND',
				'filter': filters[i]
			};

			this.queryObject.having.push(obj);
		}
	}else if(typeof filters === 'string') {
		this.queryObject.having.push({
			'condition': 'AND',
			'filter': filters
		});
	}else {
		throw 'Unsupported type for \'having\' function.';
	}

	return this;
};

/*
This function adds having conditions
 */
QueryBuilder.prototype.andHaving = function(filters) {
	if(!Array.isArray(this.queryObject.having)) {
		this.queryObject.having = [];
	}

	if(Array.isArray(filters)) {
		for(var i = 0; i < filters.length; i++) {
			var obj = {
				'condition': 'AND',
				'filter': filters[i]
			};

			this.queryObject.having.push(obj);
		}
	}else if(typeof filters === 'string') {
		this.queryObject.having.push({
			'condition': 'AND',
			'filter': filters
		});
	}else {
		throw 'Unsupported type for \'andHaving\' function.';
	}

	return this;
};

/*
This function adds having conditions
 */
QueryBuilder.prototype.orHaving = function(filters) {
	if(!Array.isArray(this.queryObject.having)) {
		this.queryObject.having = [];
	}

	if(Array.isArray(filters)) {
		for(var i = 0; i < filters.length; i++) {
			var obj = {
				'condition': 'OR',
				'filter': filters[i]
			};

			this.queryObject.having.push(obj);
		}
	}else if(typeof filters === 'string') {
		this.queryObject.having.push({
			'condition': 'OR',
			'filter': filters
		});
	}else {
		throw 'Unsupported type for \'orHaving\' function.';
	}

	return this;	
};

/*
This function set offset to sql
 */
QueryBuilder.prototype.offset = function(offset) {
	if(!Number.isInteger(offset)) {
		throw 'Unsupported type for \'offset\' function.';
	}

	this.queryObject.offset = offset;

	return this;
};

/*
This function set limit to sql
 */
QueryBuilder.prototype.limit = function(limit) {
	if(!Number.isInteger(limit)) {
		throw 'Unsupported type for \'limit\' function.';
	}

	this.queryObject.limit = limit;

	return this;
};

/*
This function binds parameters to sql
 */
QueryBuilder.prototype.setParameter = function(parameter) {
	if(!Array.isArray(this.queryParameters)) {
		this.queryParameters = [];
	}

	if(typeof parameter == 'object' ) {
		this.queryParameters = parameter;
	}else if(!Array.isArray(this.parameter)) {
		this.queryParameters.push(parameter);
	}else {
		for(var i in parameter) {
			this.queryParameters[i] = parameter[i];
		}
	}

	return this;
};

/*
This function binds parameters to sql
Warning: This function override all other 
 */
QueryBuilder.prototype.setParameters = function(parameters) {
	this.queryParameters = parameters;

	return this;
};

/*
This function allow to execute raw sql strings
WARNING: This function override all other functions
 */
QueryBuilder.prototype.raw = function(sqlString, parameters = []) {
	if(typeof sqlString !== 'string') {
		throw 'Unsupported type for \'raw\' function.';
	}

	this.queryObject = {};
	this.queryString = sqlString;
	this.queryParameters = parameters;

	return this;
};

/*
This function executes queries these are create with query builder.
 */
QueryBuilder.prototype.execute = function(countParam = false, callback) {
	// check params
	if(typeof countParam == 'function') {
		callback = countParam;
		countParam = false;
	}

	var queryCreator = null;

	switch(this.databaseType) {
		case 'ORACLE':
			queryCreator = 
				new OracleQueryCreator(this.queryObject, this.serverVersion);
			break;
		case 'MYSQL':
			queryCreator = new MysqlQueryCreator(this.queryObject);
			break;
		default:
			queryCreator = 
				new OracleQueryCreator(this.queryObject, this.serverVersion);
			break;
	}

	var sqlString = '';
	var countSqlString = '';
	
	if(this.queryObject.insert) {
		sqlString = queryCreator.createInsertQuery();
	}else if(this.queryObject.update) {
		sqlString = queryCreator.createUpdateQuery();
	}else {
		// check raw or object
		if(!this.queryString || this.queryString == '') {
			var sqlObject = queryCreator.createSelectQuery();
			sqlString = sqlObject.sqlString;

			if(countParam) {
				countSqlString = sqlObject.countString;
			}
		}else{
			sqlString = this.queryString;

			if(countParam) {
				countSqlString = queryCreator.createCountQueryFromRaw(sqlString);
			}
		}
	}

	this.db.execute(sqlString, this.queryParameters, countSqlString, callback);
};

/*
This function gives prepared sql string
 */
QueryBuilder.prototype.getSql = function() {
	if(!isObjectEmpty(this.queryObject)) {
		var queryCreator = null;

		switch(this.databaseType) {
			case 'ORACLE':
				queryCreator = new OracleQueryCreator(this.queryObject, 
					this.serverVersion);
				break;
			case 'MYSQL':
				queryCreator = new MysqlQueryCreator(this.queryObject);
				break;
			default:
				queryCreator = new OracleQueryCreator(this.queryObject, 
					this.serverVersion);
				break;
		}
		var sqlString = '';

		if(this.queryObject.insert) {
			sqlString = queryCreator.createInsertQuery();
		}else if(this.queryObject.update) {
			sqlString = queryCreator.createUpdateQuery();
		}else {
			var sqlObject = queryCreator.createSelectQuery();
			sqlString = sqlObject.sqlString;
		}

		return sqlString;
	}

	return '';
};

/*
This function gives parameters
 */
QueryBuilder.prototype.getParameters = function() {
	return this.queryParameters;
};

/*
This function insert to table 
*/
QueryBuilder.prototype.insert = function(table) {
	if(typeof table !== 'string') {
		throw 'Unsupported type for \'insert\' function.';
	}

	this.queryObject.insert = table;

	return this;
};

/*
This function set properties for insert
*/
QueryBuilder.prototype.set = function(params, alias) {
	if(!Array.isArray(this.queryObject.set)) {
		this.queryObject.set = [];
	}

	if(Array.isArray(params)) {
		for(var i in params) {
			var item = params[i];
	
			if(item.hasOwnProperty('property') 
				&& item.hasOwnProperty('alias')) {
				
				var arr = {
					property: item.property,
					alias: item.alias
				};
				this.queryObject.set.push(arr);
			}
		}
	}else if(typeof params === 'string') {
		var arr = {
			property: params,
			alias: alias
		};
		this.queryObject.set.push(arr);
	}else {
		throw 'Unsupported type for \'set\' function.';
	}

	return this;
};

QueryBuilder.prototype.update = function(table, alias) {
	if(typeof table !== 'string') {
		throw 'Unsupported type for \'update\' function.';
	}

	this.queryObject.update = {};
	this.queryObject.update.table = table;
	this.queryObject.update.alias = alias;

	return this;
};

var isObjectEmpty = function(obj) {
	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			return false;
		}
	}

	return true;
};

module.exports = QueryBuilder;