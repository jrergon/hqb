var chai = require('chai');
var expect = chai.expect;
var QueryBuilder = require('./../QueryBuilder');

describe('QueryBuilder for Oracle', function(){
	it('select function single column', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.select("BUS_ID");

		expect(qb.queryObject.select).to.be.an('array');
		expect(qb.queryObject.select).to.have.deep.members(['BUS_ID']);
		expect(qb.queryObject.select).to.have.lengthOf(1);
	});

	it('select function with multiple column', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.select(["BUS_ID", "COMPANY_ID"]);

		expect(qb.queryObject.select).to.be.an('array');
		expect(qb.queryObject.select).to.have.deep.members(['BUS_ID', 'COMPANY_ID']);
		expect(qb.queryObject.select).to.have.lengthOf(2);
	});

	it('addselect function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.addSelect("BUS_ID");
		qb.addSelect("COMPANY_ID");

		expect(qb.queryObject.select).to.be.an('array');
		expect(qb.queryObject.select).to.have.deep.members(['BUS_ID', 'COMPANY_ID']);
		expect(qb.queryObject.select).to.have.lengthOf(2);
	});

	it('select function overrides the object', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.addSelect("BUS_ID");
		qb.addSelect("COMPANY_ID");

		qb.select("BRAND_ID");

		expect(qb.queryObject.select).to.be.an('array');
		expect(qb.queryObject.select).to.have.deep.members(['BRAND_ID']);
		expect(qb.queryObject.select).to.have.lengthOf(1);
	});

	it('from function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.from("HQB_TEST_BUS", "a");

		expect(qb.queryObject.from).to.be.an('object');
		expect(qb.queryObject.from).to.have.deep.property('tableName', 'HQB_TEST_BUS');
		expect(qb.queryObject.from).to.have.deep.property('alias', 'a');
	});

	it('from function overrides the object', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.from("HQB_TEST_BUS", "a");
		qb.from("HQB_TEST_COMPANY", "a");

		expect(qb.queryObject.from).to.be.an('object');
		expect(qb.queryObject.from).to.have.deep.property('tableName', 'HQB_TEST_COMPANY');
		expect(qb.queryObject.from).to.have.deep.property('alias', 'a');
	});

	it('where function with string parameter', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.where("BUS_ID = 101");

		expect(qb.queryObject.where).to.be.an('array');
		expect(qb.queryObject.where).to.have.deep.members([ { condition : "AND", filter : "BUS_ID = 101" } ]);
		expect(qb.queryObject.where).to.have.lengthOf(1);
	});

	it('where function with array parameter', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.where([
			"BUS_ID = 101",
			"COMPANY_ID = 1"
		]);

		expect(qb.queryObject.where).to.be.an('array');
		expect(qb.queryObject.where).to.have.deep.members([ { condition : "AND", filter : "BUS_ID = 101" }, { condition : "AND", filter : "COMPANY_ID = 1" } ]);
		expect(qb.queryObject.where).to.have.lengthOf(2);
	});

	it('andWhere function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.where("BUS_ID = 101");
		qb.andWhere("COMPANY_ID = 1");

		expect(qb.queryObject.where).to.be.an('array');
		expect(qb.queryObject.where).to.have.deep.members([ { condition : "AND", filter : "BUS_ID = 101" }, { condition : "AND", filter : "COMPANY_ID = 1" } ]);
		expect(qb.queryObject.where).to.have.lengthOf(2);
	});

	it('orWhere function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.where("BUS_ID = 101");
		qb.orWhere("COMPANY_ID = 1");

		expect(qb.queryObject.where).to.be.an('array');
		expect(qb.queryObject.where).to.have.deep.members([ { condition : "AND", filter : "BUS_ID = 101" }, { condition : "OR", filter : "COMPANY_ID = 1" } ]);
		expect(qb.queryObject.where).to.have.lengthOf(2);
	});

	it('where function overrides the object', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.where("BUS_ID = 101");
		qb.andWhere("BRAND_ID = 1");
		qb.orWhere("COMPANY_ID = 1");

		qb.where("PLATE = 35DP346");

		expect(qb.queryObject.where).to.be.an('array');
		expect(qb.queryObject.where).to.have.deep.members([ { condition : "AND", filter : "PLATE = 35DP346" } ]);
		expect(qb.queryObject.where).to.have.lengthOf(1);
	});

	it('join function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.join("HQB_TEST_COMPANY", "b", "a.company_id = b.company_id");

		expect(qb.queryObject.join).to.be.an('array');
		expect(qb.queryObject.join).to.have.deep.members([ { type : "INNER", tableName : "HQB_TEST_COMPANY", alias : "b", conditions : "a.company_id = b.company_id" }]);
		expect(qb.queryObject.join).to.have.lengthOf(1);
	});

	it('left join function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.leftJoin("HQB_TEST_COMPANY", "b", "a.company_id = b.company_id");

		expect(qb.queryObject.join).to.be.an('array');
		expect(qb.queryObject.join).to.have.deep.members([ { type : "LEFT", tableName : "HQB_TEST_COMPANY", alias : "b", conditions : "a.company_id = b.company_id" }]);
		expect(qb.queryObject.join).to.have.lengthOf(1);
	});

	it('right join function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.rightJoin("HQB_TEST_COMPANY", "b", "a.company_id = b.company_id");

		expect(qb.queryObject.join).to.be.an('array');
		expect(qb.queryObject.join).to.have.deep.members([ { type : "RIGHT", tableName : "HQB_TEST_COMPANY", alias : "b", conditions : "a.company_id = b.company_id" }]);
		expect(qb.queryObject.join).to.have.lengthOf(1);
	});

	it('all join functions', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.join("HQB_TEST_COMPANY", "b", "a.company_id = b.company_id");
		qb.leftJoin("HQB_TEST_BUS", "c", "a.bus_id = c.bus_id");
		qb.rightJoin("HQB_TEST_BRAND", "d", "a.brand_id = d.brand_id");

		expect(qb.queryObject.join).to.be.an('array');
		expect(qb.queryObject.join).to.have.deep.members([ 
			{ type : "INNER", tableName : "HQB_TEST_COMPANY", alias : "b", conditions : "a.company_id = b.company_id" },
			{ type : "LEFT", tableName : "HQB_TEST_BUS", alias : "c", conditions : "a.bus_id = c.bus_id" },
			{ type : "RIGHT", tableName : "HQB_TEST_BRAND", alias : "d", conditions : "a.brand_id = d.brand_id" }
		]);
		expect(qb.queryObject.join).to.have.lengthOf(3);
	});

	it('orderby function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.orderBy("BUS_ID", "ASC");

		expect(qb.queryObject.orderBy).to.be.an('array');
		expect(qb.queryObject.orderBy).to.have.deep.members([ { column : "BUS_ID", direction : "ASC" } ]);
		expect(qb.queryObject.orderBy).to.have.lengthOf(1);
	});

	it('addOrderby function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.orderBy("BUS_ID", "ASC");
		qb.addOrderBy("COMPANY_ID", "DESC");

		expect(qb.queryObject.orderBy).to.be.an('array');
		expect(qb.queryObject.orderBy).to.have.deep.members([ { column : "BUS_ID", direction : "ASC" }, { column : "COMPANY_ID", direction : "DESC" }]);
		expect(qb.queryObject.orderBy).to.have.lengthOf(2);
	});

	it('orderBy function overrides the object', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.orderBy("BUS_ID", "ASC");
		qb.addOrderBy("COMPANY_ID", "DESC");
		qb.orderBy("BRAND_ID", "DESC");

		expect(qb.queryObject.orderBy).to.be.an('array');
		expect(qb.queryObject.orderBy).to.have.deep.members([ { column : "BRAND_ID", direction : "DESC" } ]);
		expect(qb.queryObject.orderBy).to.have.lengthOf(1);
	});

	it('groupBy function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.groupBy("COMPANY_ID");

		expect(qb.queryObject.groupBy).to.be.an('array');
		expect(qb.queryObject.groupBy).to.have.deep.members([ 'COMPANY_ID' ]);
		expect(qb.queryObject.groupBy).to.have.lengthOf(1);
	});

	it('addGroupBy function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.groupBy("COMPANY_ID");
		qb.addGroupBy("BRAND_ID");

		expect(qb.queryObject.groupBy).to.be.an('array');
		expect(qb.queryObject.groupBy).to.have.deep.members([ 'COMPANY_ID', 'BRAND_ID' ]);
		expect(qb.queryObject.groupBy).to.have.lengthOf(2);
	});

	it('groupBy function overrides the object', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.groupBy("COMPANY_ID");
		qb.addGroupBy("BRAND_ID");
		qb.groupBy("BUS_ID");

		expect(qb.queryObject.groupBy).to.be.an('array');
		expect(qb.queryObject.groupBy).to.have.deep.members([ 'BUS_ID' ]);
		expect(qb.queryObject.groupBy).to.have.lengthOf(1);
	});

	it('having function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.having("COUNT(BUS_ID) > 1");

		expect(qb.queryObject.having).to.be.an('array');
		expect(qb.queryObject.having).to.have.deep.members([ { condition : "AND", filter : "COUNT(BUS_ID) > 1" } ]);
		expect(qb.queryObject.having).to.have.lengthOf(1);
	});

	it('having function with array parameter', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.having([
			"COUNT(BUS_ID) > 1",
			"SUM(COMPANY_ID) < 2"
		]);

		expect(qb.queryObject.having).to.be.an('array');
		expect(qb.queryObject.having).to.have.deep.members([ { condition : "AND", filter : "COUNT(BUS_ID) > 1" }, { condition : "AND", filter : "SUM(COMPANY_ID) < 2" } ]);
		expect(qb.queryObject.having).to.have.lengthOf(2);
	});

	it('andHaving function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.having("COUNT(BUS_ID) > 1");
		qb.andHaving("SUM(COMPANY_ID) < 2");

		expect(qb.queryObject.having).to.be.an('array');
		expect(qb.queryObject.having).to.have.deep.members([ { condition : "AND", filter : "COUNT(BUS_ID) > 1" }, { condition : "AND", filter : "SUM(COMPANY_ID) < 2" } ]);
		expect(qb.queryObject.having).to.have.lengthOf(2);
	});

	it('orHaving function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.having("COUNT(BUS_ID) > 1");
		qb.orHaving("SUM(COMPANY_ID) < 2");

		expect(qb.queryObject.having).to.be.an('array');
		expect(qb.queryObject.having).to.have.deep.members([ { condition : "AND", filter : "COUNT(BUS_ID) > 1" }, { condition : "OR", filter : "SUM(COMPANY_ID) < 2" } ]);
		expect(qb.queryObject.having).to.have.lengthOf(2);
	});

	it('having function overrides the object', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.having("COUNT(BUS_ID) > 1");
		qb.orHaving("SUM(COMPANY_ID) < 2");
		qb.orHaving("COUNT(BRAND_ID) > 1");

		qb.having("SUM(BUS_ID) > 1");

		expect(qb.queryObject.having).to.be.an('array');
		expect(qb.queryObject.having).to.have.deep.members([ { condition : "AND", filter : "SUM(BUS_ID) > 1" } ]);
		expect(qb.queryObject.having).to.have.lengthOf(1);
	});

	it('offset function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);

		qb.offset(10);

		expect(qb.queryObject.offset).to.equal(10);
	});

	it('limit function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);

		qb.limit(10);

		expect(qb.queryObject.limit).to.equal(10);
	});

	it('setParameter function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);

		qb.setParameter({ busId : 101 });

		expect(qb.queryParameters).to.be.an('object');
		expect(qb.queryParameters).to.have.own.property('busId');
		expect(qb.queryParameters).to.have.deep.property('busId', 101);
		expect(Object.keys(qb.queryParameters).length).to.equal(1);
	});

	it('setParameters function', function(){
		var serverVersion = '1201000000';
		var serverType = 'ORACLE';

		var qb = new QueryBuilder(serverType, serverVersion);

		qb.setParameters({ busId : 101, companyId : 1 });

		expect(qb.queryParameters).to.be.an('object');
		expect(qb.queryParameters).to.have.own.property('busId');
		expect(qb.queryParameters).to.have.own.property('companyId');
		expect(qb.queryParameters).to.have.deep.property('busId', 101);
		expect(qb.queryParameters).to.have.deep.property('companyId', 1);
		expect(Object.keys(qb.queryParameters).length).to.equal(2);
	});

	it('insert function', function() {
		var serverVersion = '1201000000';
		var serverType = 'MYSQL';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.insert('HQB_TEST_BUS');

		expect(qb.queryObject.insert).to.be.a('string');
		expect(qb.queryObject.insert).to.equal('HQB_TEST_BUS');
	});

	it('update function', function() {
		var serverVersion = '1201000000';
		var serverType = 'MYSQL';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.update('HQB_TEST_BUS');

		expect(qb.queryObject.update).to.be.an('object');
		expect(qb.queryObject.update.table).to.equal('HQB_TEST_BUS');
	});

	it('update function with alias', function() {
		var serverVersion = '1201000000';
		var serverType = 'MYSQL';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.update('HQB_TEST_BUS', 'a');

		expect(qb.queryObject.update).to.be.an('object');
		expect(qb.queryObject.update.table).to.equal('HQB_TEST_BUS');
		expect(qb.queryObject.update.alias).to.equal('a');
	});

	it('set function with array', function() {
		var serverVersion = '1201000000';
		var serverType = 'MYSQL';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.set([
			{
				property: 'NAME',
				alias: ':name'
			},
			{
				property: 'PLATE',
				alias: ':plate'
			}
		]);

		expect(qb.queryObject.set).to.be.an('array');
		expect(qb.queryObject.set).to.have.deep.members([ 
			{
				property: 'NAME',
				alias: ':name'
			},
			{
				property: 'PLATE',
				alias: ':plate'
			}
		]);
		expect(qb.queryObject.set).to.have.lengthOf(2);
	});

	it('set function with two parameters', function() {
		var serverVersion = '1201000000';
		var serverType = 'MYSQL';

		var qb = new QueryBuilder(serverType, serverVersion);
		qb.set('NAME', ':name');

		expect(qb.queryObject.set).to.be.an('array');
		expect(qb.queryObject.set).to.have.deep.members([ 
			{
				property: 'NAME',
				alias: ':name'
			}
		]);
		expect(qb.queryObject.set).to.have.lengthOf(1);
	});
});