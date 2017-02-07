'use strict';
var CONFIG = require('../utils/config.js').DATABASE;
var mySql = require('mysql');

//Use for local tests only
var mysqlPool = mySql.createPool(CONFIG);
//var mysqlPool = mySql.createPool(process.env.JAWSDB_URL);

module.exports = {
	mysql : mySql,
	pool : mysqlPool
}