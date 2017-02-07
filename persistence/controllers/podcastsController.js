var podcastsModel = require('../models/podcasts.js');

module.exports = {

	insert : function(podcast, callback) {
		podcastsModel.insertPodcast(podcast, callback);
	},

	delete : function(podcastId, callback) {
		podcastsModel.deletePodcast(podcastId, callback);
	},

	update : function(podcastId, podcast, callback) {
		podcastsModel.updatePodcast(podcastId, podcast, callback);
	},

	getShow : function(url, callback) {
		podcastsModel.getPodcast(url, callback);
	},

	getAll : function(callback) {
		podcastsModel.getPodcasts(callback);
	},

	getReviews : function(callback) {
		podcastsModel.getReviews(callback);
	},

	getShows : function(callback) {
		podcastsModel.getShows(callback);
	},

	getLastPodcast : function(callback) {
		podcastsModel.getLastPodcast(callback);
	},

	getLastReview : function(callback) {
		podcastsModel.getLastReview(callback);
	}
};
