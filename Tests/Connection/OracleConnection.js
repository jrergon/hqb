var chai = require('chai');
var expect = chai.expect;
var OracleConnection = require('./../../Connection/OracleConnection');
var oracledb = require('oracledb');
var testConfig = require('./../config');

describe('OracleConnection', function(){
	it('initConnection should set a promise for pooled connection that resolves Connection object.', function(){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.a("Connection");

			conn.close();
		});
	});

	it('initConnection should set a promise for direct connection that resolves Connection object.', function(){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.a("Connection");

			conn.close();
		});
	});

	it('setConnection should set a promise for pooled connection that resolves Connection object.', function(){
		var oracleConnection = new OracleConnection();
		var config = {
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		};

		var prm = new Promise(function(resolve, reject){
			oracledb.createPool(config, function(err, pool){
				if(err){
					var defaultPool = oracledb.getPool(config.poolAlias);
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

		oracleConnection.setConnection(prm);

		return oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.an("Connection");

			conn.close();
		});
	});

	it('setConnection should set a promise for direct connection that resolves Connection object.', function(){
		var oracleConnection = new OracleConnection();
		var config = {
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		};

		var prm = new Promise(function(resolve, reject){
			oracledb.getConnection(config, function(err, conn){
				if(err)
					reject(err);
				else
					resolve(conn);
			});
		});

		oracleConnection.setConnection(prm);

		return oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.an("Connection");

			conn.close();
		});
	});

	it('execute should return data.', function(){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return oracleConnection.execute("Select * from HQB_TEST_BUS where 1 = ?",[1], "", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(4);
		});
	});

	it('execute should return empty array.', function(){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return	oracleConnection.execute("Select * from HQB_TEST_BUS where 1 = ?",[0], "", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(0);
		});
	});

	it('getServerVersion return version of oracle database as string', function(){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return oracleConnection.getServerVersion(function(data){
			expect(data).to.be.a('string');
			expect(data).to.have.lengthOf.above(9);
		});
	});
});