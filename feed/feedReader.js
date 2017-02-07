var parse = require('feed-reader').parse;
var dateUtil = require('date-and-time');
var cache = require('memory-cache');
var podcastController = require('../persistence/controllers/podcastsController.js');
var userController = require('../persistence/controllers/userController.js');

const URL_BASE = 'http://trocaodisco.com.br/';
const DATE_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss';
const KEY_DATE = 'publishedDate';

var url = 'http://feeds.feedburner.com/trocaodisco?format=xml';

var parseFeed = function() {
	parse(url).then((feed) => {

	 	 var delay = 0;
	 	 feed.entries.forEach( function(element, index) {
	 	 	setTimeout(function() {
	 	 		checkContent(element);
			}, delay);
			if ((index + 1) % 8 == 0) {
				delay = delay + 2000;
			}
		});
		}).catch((err) => {
	  	console.log(err);
		}).finally(() => {
			console.log("Data fetched, everything is up to date!");
	});
};

var checkContent = function(content) {

	var date = new Date(content.publishedDate);
	var strArray = content.link.split('/');
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var link = URL_BASE + year + '/' + month + '/' + strArray[strArray.length -1];

	var podcast = {
				post_url : link,
				post_title : content.title,
				published_date : dateUtil.parse(content.publishedDate, DATE_FORMAT)
			};
	var cachedDate = new Date(cache.get(KEY_DATE));
	if (podcast.published_date > cachedDate) {
		require('../app.js').sendShow(podcast.post_url);
		cache.put(KEY_DATE, podcast.published_date);
	}

	podcastController.getShow(link, function(result, dbError) {
		if (result.length <= 0) {
			podcastController.insert(podcast, function(result, dbError) {
				if (dbError) {
					console.log('DB Error! Cannot insert item.');
				}
				//console.log('Success! Item inserted');
			});
		}
		else {
			podcastController.update(result[0].id_podcasts, podcast, function(result, dbError) {
				if (dbError) {
					console.log('DB Error! Cannot update item.');
				}
				else {
					//console.log('Success! Item updated');
				}
			});
		}
	});
};

module.exports = {
	updateFeed : parseFeed
};