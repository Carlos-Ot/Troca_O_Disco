/* --------- Define Database Constants --------- 
*  
*  Defines database tables with their columns
*
*/

var tableUsers = {
	TABLE_NAME : 'users',

	COLUMNS : {
		userId : 'user_id',

		userName : 'user_name'
	}
};

var tablePodcasts = {
	TABLE_NAME : 'podcasts',

	COLUMNS : {
		podcastId : 'id_podcasts',

		postUrl : 'post_url',

		postTitle : 'post_title',

		publishedDate : 'published_date'
	} 
};

module.exports = {
	TABLE_USERS : tableUsers,
	TABLE_PODCASTS : tablePodcasts
};