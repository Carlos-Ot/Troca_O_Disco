var connection = require('../connection.js');
var table = require ('../databaseConstants.js').TABLE_USERS;

var pool = connection.pool;

var insertRow = function(param, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err);
			return;
		}

		var sql = 'INSERT INTO ?? SET ?';
		var query = connection.query(sql, [table.TABLE_NAME, param], function(err, result) {
			if (err) console.log(err.code);

			console.log(query.sql);
			callback(result, err);
		});
		connection.release();
	});
};

var deleteRow = function (param, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'DELETE FROM ?? WHERE ?? = ?';
		var query = connection.query(sql, [table.TABLE_NAME, table.COLUMNS.userId, param], function(err, result) {
			if (err) console.log(err.code);

			console.log(query.sql);	
			callback(result, err);
		});
		connection.release();
	});
};

var updateRow = function (userId, user, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'UPDATE ' + table.TABLE_NAME + ' SET ? WHERE userId = ?';
		var query = connection.query(sql, [user, userId], function(err, result) {
			if (err) console.log(err.code);

			console.log(query.sql);	
			callback(result);
		});
		connection.release();
	});
};

var selectAll = function (callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'SELECT * FROM ??';
		var query = connection.query(sql, [table.TABLE_NAME], function(err, result) {
			if (err) console.log(err.code);

			console.log(query.sql);	
			callback(result);
		});
		connection.release();
	});
};

module.exports = {
	insertUser : insertRow,
	deleteUser : deleteRow,
	updateUser : updateRow,
	getUsers : selectAll
};
