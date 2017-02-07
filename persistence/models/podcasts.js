var connection = require('../connection.js');
var table = require ('../databaseConstants.js').TABLE_PODCASTS;

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
		var query = connection.query(sql, [table.TABLE_NAME, table.COLUMNS.podcastId, param], function(err, result) {
			if (err) console.log(err.code);

			callback(result, err);
		});
		connection.release();
	});
};

var updateRow = function (podcastId, podcast, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'UPDATE ' + table.TABLE_NAME + ' SET ? WHERE id_podcasts = ?';
		var query = connection.query(sql, [podcast, podcastId], function(err, result) {
			if (err) console.log(err.code);

			callback(result);
		});
		connection.release();
	});
};

var selectPodcast = function (url, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'SELECT * FROM ?? WHERE post_url = ?';
		var query = connection.query(sql, [table.TABLE_NAME, url], function(err, result) {
			if (err) console.log(err.code);

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

			callback(result);
		});
		connection.release();
	});
};

var selectAllReviews = function (callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'SELECT * FROM ?? WHERE post_title LIKE ' + connection.escape('%' + 'Album' + '%' + 'Review' + '%') + ' ORDER BY published_date DESC LIMIT 5';
		var query = connection.query(sql, [table.TABLE_NAME], function(err, result) {
			if (err) console.log(err.code);

			callback(result);
		});
		connection.release();
	});
};

var selectAllShows = function (callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'SELECT * FROM ?? WHERE post_title NOT LIKE ' + connection.escape('%' + 'Album' + '%' + 'Review' + '%') + ' ORDER BY published_date DESC LIMIT 5';
		var query = connection.query(sql, [table.TABLE_NAME], function(err, result) {
			if (err) console.log(err.code);

			callback(result);
		});
		connection.release();
	});
};

var selectLastPodcast = function (callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'SELECT * FROM ?? WHERE post_title NOT LIKE ' + connection.escape('%' + 'Album' + '%' + 'Review' + '%') + ' ORDER BY published_date DESC LIMIT 1';
		var query = connection.query(sql, [table.TABLE_NAME], function(err, result) {
			if (err) console.log(err.code);

			callback(result);
		});
		connection.release();
	});
};

var selectLastReview = function (callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err.code);
			callback(err.code, err);
			return;
		}

		var sql = 'SELECT * FROM ?? WHERE post_title LIKE ' + connection.escape('%' + 'Album' + '%' + 'Review' + '%') + ' ORDER BY published_date DESC LIMIT 1';
		var query = connection.query(sql, [table.TABLE_NAME], function(err, result) {
			if (err) console.log(err.code);

			callback(result);
		});
		connection.release();
	});
};

module.exports = {
	insertPodcast : insertRow,
	removePodcast : deleteRow,
	updatePodcast : updateRow,
	getPodcast : selectPodcast,
	getPodcasts : selectAll,
	getReviews : selectAllReviews,
	getShows : selectAllShows,
	getLastPodcast : selectLastPodcast,
	getLastReview : selectLastReview
};
