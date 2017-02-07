var userModel = require('../models/users.js');

module.exports = {

	insert : function(user, callback) {
		userModel.insertUser(user, callback);
	},

	delete : function(userId, callback) {
		userModel.deleteUser(userId, callback);
	},

	update : function(userId, user, callback) {
		userModel.updateUser(userId, user, callback);
	},

	getAll : function(callback) {
		userModel.getUsers(callback);
	}
};