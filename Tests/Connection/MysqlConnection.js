var chai = require('chai');
var expect = chai.expect;
var MysqlConnection = require('./../../Connection/MysqlConnection');
var mysql = require('mysql');
var testConfig = require('./../config');

describe('MysqlConnection', function(){
	it('initConnection for pooled connection.', function(){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
			poolAlias: testConfig.mysqlDb.poolAlias,
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		expect(mysqlConnection.connection.constructor.name).to.be.equal('Pool');

		mysqlConnection.closeConnection();
	});

	it('initConnection for classic connection', function(){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		expect(mysqlConnection.connection.constructor.name).to.be.equal('Connection');

		mysqlConnection.closeConnection();
	});

	it('checkConnection with success connection', function(done){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		mysqlConnection.checkConnection(function(status) {
			expect(mysqlConnection.connection.constructor.name).to.be.equal('Connection');
			expect(status).to.be.equal(true);

			mysqlConnection.closeConnection();
			done();
		});
	});

	it('checkConnection with unsuccessful connection', function(done){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
		    connectString: testConfig.mysqlDb.connectString,  
		    user: 'test',  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		mysqlConnection.checkConnection(function(status) {
			expect(mysqlConnection.connection.constructor.name).to.be.equal('Connection');
			expect(status).to.be.equal(false);

			mysqlConnection.closeConnection();
			done();
		});
	});

	it('execute should return data.', function(done){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
			poolAlias: testConfig.mysqlDb.poolAlias,
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		mysqlConnection.execute("Select * from HQB_TEST_BUS where 1 = ?", [1], "", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(5);

			mysqlConnection.closeConnection();
			done();
		});
	});

	it('execute with count should return data and count.', function(done){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
			poolAlias: testConfig.mysqlDb.poolAlias,
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		mysqlConnection.execute("Select * from HQB_TEST_BUS where 1 = ?", [1], "Select COUNT(*) as CNT from HQB_TEST_BUS where 1 = ?", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(5);
			expect(data.count).to.equal(5);

			mysqlConnection.closeConnection();
			done();
		});
	});

	it('execute should return empty array.', function(done){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
			poolAlias: testConfig.mysqlDb.poolAlias,
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		mysqlConnection.execute("Select * from HQB_TEST_BUS where 1 = ?", [0], "", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(0);

			mysqlConnection.closeConnection();
			done();
		});
	});

	it('execute should return empty array and 0 as count', function(done){
		var mysqlConnection = new MysqlConnection();

		mysqlConnection.initConnection({
			poolAlias: testConfig.mysqlDb.poolAlias,
		    connectString: testConfig.mysqlDb.connectString,  
		    user: testConfig.mysqlDb.user,  
		    password: testConfig.mysqlDb.password,
		    database: testConfig.mysqlDb.database
		});

		mysqlConnection.execute("Select * from HQB_TEST_BUS where 1 = ?", [0], "Select COUNT(*) as CNT from HQB_TEST_BUS where 1 = ?", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(0);
			expect(data.count).to.equal(0);

			mysqlConnection.closeConnection();
			done();
		});
	});
});