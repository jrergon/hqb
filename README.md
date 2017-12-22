# hqb

> **Query Builder For Nodejs!**

The Hqb aims to handle all database layer operations. For now, It basically supports to create complex select queries and execute them properly.
Also, You can use raw function for all other stuffs like insert, update, delete.

## Dialects

- Oracle
- MySql ( partly support for now )

## Depencies

- [oracledb](https://github.com/oracle/node-oracledb),
- [mysql](https://github.com/mysqljs/mysql),
- [mocha](https://github.com/mochajs/mocha),
- [chai](https://github.com/chaijs/chai),

## Getting Started
	
There is sql files to create mock tables for testing purposes in `Tests/Databases/Oracle`. In this section, this tables will be used.

### Installation

`hqb` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install hqb

### Initialize, Connection and Query

You can initialize connection with either a config or connection promise.

#### initConnection

The initConnection function creates a connection promise with given config parameters for future uses. Config can contains all [oracledb](https://github.com/oracle/node-oracledb)'s connection configurations. 

- type : could ORACLE or MYSQL
- poolAlias : If set hqb tries to use pool connection
- serverVersion : It is required for oracle connections. With 12c, Oracle has better limiting clause.


```js
var Hqb = require('hqb');

var hqb = new Hqb();
hqb.initConnection({
	type : 'ORACLE',
	poolAlias: 'poolAlias',
    connectString: 'connectString',  
    user: 'user',  
    password: 'password',
    serverVersion : 1201000000
});
```

#### setConnection

setConnection function takes a database type and connection promise to use when executes sql.


```js
var Hqb = require('hqb');
var oracledb = require('oracledb');

var hqb = new Hqb();
var config = {
	connectString: 'connectString',  
	user: 'user',  
	password: 'password',
};

var prm = new Promise(function(resolve, reject){
	oracledb.getConnection(config, function(err, conn){
		if(err)
			reject(err);
		else
			resolve(conn);
	});
});

hqb.setConnection("ORACLE", prm);
```

#### setAutoCommit

Set auto commit, default is true :

```js
hqb.setAutoCommit(boolean); 
```

#### setFetchMode

Set fetch mode, 'OBJECT' or 'ARRAY' - Default OBJECT

```js
hqb.setFetchMode(string); 
```

#### setFetchSize

Set fetch size, integer - Default 100000

```js
hqb.setFetchSize(integer); 
```

#### beginTransaction

Begin transaction :

```js
hqb.beginTransaction(); 
```

#### commit

Commit transaction :

> Note: 'commit' set auto commit property to true after commit the changes

```js
hqb.commit(); 
```

#### rollback

Rollback transaction :

> Note: 'rollback' set auto commit property to true after rollback the changes

```js
hqb.rollback(); 
```

#### getConnection

You can get connection from hqb via this function.

```js
hqb.getConnection(callback); 
```

#### closeConnection

Close connection.

> Note: Dont forget the close connection.

```js
hqb.closeConnection(); 
```

#### createQueryBuilder

The function gives an QueryBuilder object.

##### QueryBuilder Class

This is the class that handles all operations about sql.

###### select and addSelect

This functions fill the columns on select query. Both support array and string as parameter.

> Note: 'select' overrides previous calls to select and addSelect


```js
qb.select(column);

qb.select([column1, column2]);

qb.addSelect(column);

qb.addSelect([column1, column2]);
```

###### from

This function set the main table of select query. 


```js
qb.from(tableName);

qb.from(tableName, tableAlias);
```


###### where, andWhere, orWhere

This functions add where conditions to query. All support array and string as parameter.

> Note: 'where' overrides previous calls to where, andWhere and orWhere


```js
qb.where(cond1);

qb.where([cond1, cond2]);

qb.andWhere(cond1);

qb.andWhere([cond1, cond2]);

qb.orWhere(cond1);

qb.orWhere([cond1, cond2]);
```

###### join, leftJoin, rightJoin

This functions add joins.

Note : 'joinConditions' is an optional parameter.

```js
qb.join(tableName, alias, joinConditions);

qb.leftJoin(tableName, alias, joinConditions);

qb.rightJoin(tableName, alias, joinConditions);
```


###### orderBy and addOrderBy

This functions add order clause.

> Note: 'orderBy' overrides previous calls to orderBy and addOrderBy


```js
qb.orderBy(column);

qb.orderBy(column, direction);

qb.addOrderBy(column);

qb.addOrderBy(column, direction);
```


###### groupBy and addGroupBy

This functions add group by clause.

> Note: 'groupBy' overrides previous calls to groupBy and addGroupBy


```js
qb.groupBy(column);

qb.groupBy(column);

qb.addGroupBy(column);

qb.addGroupBy(column);
```


###### having, andHaving, orHaving

This functions add having conditions to query. All support array and string as parameter.

> Note: 'having' overrides previous calls to having, andHaving and orHaving


```js
qb.having(cond1);

qb.having([cond1, cond2]);

qb.andHaving(cond1);

qb.andHaving([cond1, cond2]);

qb.orHaving(cond1);

qb.orHaving([cond1, cond2]);
```


###### offset and limit

You can handle limiting operations with this functions.


```js
qb.offset(recordOffsetToReturn);

qb.limit(recordCountToReturn);
```


###### setParameter and setParameters

This functions binding parameters to sql.

> Note: 'setParameters' overrides previous calls to setParameter and setParameters

```js
qb.setParameter({ bindName : bindValue });

qb.setParameters([{ bindName1 : bindValue1 }, { bindName2 : bindValue2 }]);
```


###### raw

This function allows you to execute all-style sql queries with hqb.

> Note: 'raw' overrides all previous calls

```js
qb.raw(query, parameters);
```


###### execute

This function executes the query with provided/created via above functions. Also this function can give data count executed sql without limits. This count query is handled asynchronously in executor, so time loss is minimized.

```js
// countParam is a boolean and default is false
qb.raw(countParam, callback); 

qb.raw(callback); 
```


###### getSql

This function returns created sql.

```js
qb.getSql(); 
```


###### getParameters

This function returns bound parameters.

```js
qb.getParameters(); 
```

### Example

```js
var Hqb = require('hqb');

var hqb = new Hqb();
hqb.initConnection({
    type : 'ORACLE',
    poolAlias: 'poolAlias',
    connectString: 'connectString',  
    user: 'user',  
    password: 'password',
    serverVersion : 1201000000
});

var qb = hqb.createQueryBuilder();
qb.select(['a.plate as plate', 'b.name as company', 'c.name as brand'])
.from('HQB_TEST_BUS', 'a')
.join('HQB_TEST_COMPANY', 'b', 'a.company_id = b.company_id')
.leftJoin('HQB_TEST_BRAND', 'c', 'a.brand_id = c.brand_id')
.where('a.company_id = :companyId')
.setParameter({companyId : 1})
.offset(0)
.limit(2)
.execute(true, function(err, data){
	// do something
});
```