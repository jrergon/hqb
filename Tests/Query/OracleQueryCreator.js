var chai = require('chai');
var expect = chai.expect;
var OracleQueryCreator = require('./../../Query/OracleQueryCreator');

describe('OracleQueryCreator', function(){
	it('basic select query', function(){
		var queryObject = {
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' }
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT * FROM HQB_TEST_BUS a');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT * FROM HQB_TEST_BUS a)');
	});

	it('basic select query with Columns', function(){
		var queryObject = {
			select : ['BUS_ID', 'PLATE'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' }
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT BUS_ID,PLATE FROM HQB_TEST_BUS a');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT BUS_ID,PLATE FROM HQB_TEST_BUS a)');
	});

	it('select query with single join', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ { tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'LEFT', conditions : 'a.company_id = b.company_id'}]
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME FROM HQB_TEST_BUS a LEFT JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME FROM HQB_TEST_BUS a LEFT JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id)');
	});

	it('select query with multiple joins', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			]
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id)');
	});

	it('select query with multiple joins and where conditions', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			]
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1)');
	});

	it('select query with multiple joins, where conditions and group', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			],
			groupBy : ['a.PLATE','b.NAME','c.NAME']
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 GROUP BY a.PLATE,b.NAME,c.NAME');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 GROUP BY a.PLATE,b.NAME,c.NAME)');
	});

	it('select query with multiple joins, where and having conditions and group', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			],
			groupBy : ['a.PLATE','b.NAME','c.NAME'],
			having : [
				{ filter : 'COUNT(b.NAME) > 1', condition : 'AND' }
			]
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME)');
	});

	it('select query with multiple joins, where and having conditions, group and order', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			],
			groupBy : ['a.PLATE','b.NAME','c.NAME'],
			having : [
				{ filter : 'COUNT(b.NAME) > 1', condition : 'AND' }
			],
			orderBy : [
				{ column : 'b.name', direction : 'ASC'},
				{ column : 'a.company_id', direction : 'DESC'}
			]
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC)');
	});

	it('select query with multiple joins, where and having conditions, group, order and only offset', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			],
			groupBy : ['a.PLATE','b.NAME','c.NAME'],
			having : [
				{ filter : 'COUNT(b.NAME) > 1', condition : 'AND' }
			],
			orderBy : [
				{ column : 'b.name', direction : 'ASC'},
				{ column : 'a.company_id', direction : 'DESC'}
			],
			offset : 10
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC OFFSET 10 ROWS');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC)');
	});

	it('select query with multiple joins, where and having conditions, group, order and only limit', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			],
			groupBy : ['a.PLATE','b.NAME','c.NAME'],
			having : [
				{ filter : 'COUNT(b.NAME) > 1', condition : 'AND' }
			],
			orderBy : [
				{ column : 'b.name', direction : 'ASC'},
				{ column : 'a.company_id', direction : 'DESC'}
			],
			limit : 20
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC FETCH NEXT 20 ROWS ONLY');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC)');
	});

	it('select query with multiple joins, where and having conditions, group, order, offset and limit', function(){
		var queryObject = {
			select : ['a.PLATE', 'b.NAME', 'c.NAME'],
			from : { tableName : 'HQB_TEST_BUS', alias : 'a' },
			join : [ 
				{ tableName : 'HQB_TEST_COMPANY', alias : 'b', type : 'INNER', conditions : 'a.company_id = b.company_id'},
				{ tableName : 'HQB_TEST_BRAND', alias : 'c', type : 'LEFT', conditions : 'a.brand_id = c.brand_id'}
			],
			where : [ 
				{ filter : 'a.company_id = 1', condition : 'AND' },
				{ filter : 'a.brand_id = 1', condition : 'AND' }
			],
			groupBy : ['a.PLATE','b.NAME','c.NAME'],
			having : [
				{ filter : 'COUNT(b.NAME) > 1', condition : 'AND' }
			],
			orderBy : [
				{ column : 'b.name', direction : 'ASC'},
				{ column : 'a.company_id', direction : 'DESC'}
			],
			offset : 10,
			limit : 20
		};

		var serverVersion = '1201000000';

		queryCreator = new OracleQueryCreator(queryObject, serverVersion);
		query = queryCreator.createSelectQuery();

		expect(query.sqlString).to.equal('SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC OFFSET 10 ROWS FETCH NEXT 20 ROWS ONLY');
		expect(query.countString).to.equal('SELECT COUNT(*) as CNT FROM (SELECT a.PLATE,b.NAME,c.NAME FROM HQB_TEST_BUS a INNER JOIN HQB_TEST_COMPANY b ON a.company_id = b.company_id LEFT JOIN HQB_TEST_BRAND c ON a.brand_id = c.brand_id WHERE a.company_id = 1 AND a.brand_id = 1 HAVING COUNT(b.NAME) > 1 GROUP BY a.PLATE,b.NAME,c.NAME ORDER BY b.name ASC,a.company_id DESC)');
	});
});