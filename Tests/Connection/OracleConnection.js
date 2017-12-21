var chai = require('chai');
var expect = chai.expect;
var OracleConnection = require('./../../Connection/OracleConnection');
var oracledb = require('oracledb');
var testConfig = require('./../config');

describe('OracleConnection', function(){
	it('initConnection should set a promise for pooled connection that resolves Connection object.', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.a("Connection");

			conn.close();
			done();
		});
	});

	it('initConnection should set a promise for direct connection that resolves Connection object.', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.a("Connection");

			conn.close();
			done();
		});
	});

	it('setConnection should set a promise for pooled connection that resolves Connection object.', function(done){
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

		oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.an("Connection");

			conn.close();
			done();
		});
	});

	it('setConnection should set a promise for direct connection that resolves Connection object.', function(done){
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

		oracleConnection.getConnection().then(function(conn){
			expect(conn).to.be.an("Connection");

			conn.close();
			done();
		});
	});

	it('execute should return data.', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		oracleConnection.execute("Select * from HQB_TEST_BUS where 1 = :one",{one: 1}, "", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(5);

			oracleConnection.closeConnection();
			done();
		});
	});

	it('execute with count should return data and count.', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		oracleConnection.execute("Select * from HQB_TEST_BUS where 1 = :one",{one: 1}, "Select COUNT(*) as CNT from HQB_TEST_BUS where 1 = :one", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(5);
			expect(data.count).to.equal(5);

			oracleConnection.closeConnection();
			done();
		});
	});

	it('execute should return empty array.', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return	oracleConnection.execute("Select * from HQB_TEST_BUS where 1 = :zero",{zero: 0}, "", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(0);

			oracleConnection.closeConnection();
			done();
		});
	});

	it('execute should return empty array and 0 as count', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		return	oracleConnection.execute("Select * from HQB_TEST_BUS where 1 = :zero",{zero: 0}, "Select COUNT(*) as CNT from HQB_TEST_BUS where 1 = :zero", function(err, data){
			expect(data.data).to.be.an("array");
			expect(data.data).to.have.lengthOf(0);
			expect(data.count).to.equal(0);

			oracleConnection.closeConnection();
			done();
		});
	});

	it('getServerVersion return version of oracle database as string', function(done){
		var oracleConnection = new OracleConnection();

		oracleConnection.initConnection({
			poolAlias: testConfig.oracleDb.poolAlias,
		    connectString: testConfig.oracleDb.connectString,  
		    user: testConfig.oracleDb.user,  
		    password: testConfig.oracleDb.password
		});

		oracleConnection.getServerVersion(function(data){
			expect(data).to.have.above(999999999);

			oracleConnection.closeConnection();
			done();
		});
	});
});