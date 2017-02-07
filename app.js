var feedReader = require('./feed/feedReader.js');
var schedule = require('node-schedule');
var cache = require('memory-cache');
const TeleBot = require('telebot');
const bot = new TeleBot('273910408:AAEw3uBjAh6ltWDUkFm1OuSL9DYlRWJiVTY');

var userController = require('./persistence/controllers/userController.js');
var podcastsController = require('./persistence/controllers/podcastsController.js');


const KEY_DATE = 'publishedDate';
const INITIAL_DATE = '2016-12-17 21:00:46.000';

cache.put(KEY_DATE, INITIAL_DATE);

var rule = new schedule.RecurrenceRule();
rule.minute = 30;

var j = schedule.scheduleJob(rule, function(){
	feedReader.updateFeed();
});

/***************** <TELEGRAM> *********************/

bot.connect();

bot.on('/help', (msg, self) => {
	var commands = "*Essa é a lista de comandos que esse bot suporta:*\n\n[/help](/help) - Listar comandos\n\n[/subscribe](/subscribe) - Assinar o bot\n\n[/unsubscribe](/unsubscribe) - Sair do bot\n\n[/last_cast](/last_cast) - Último programa\n\n[/last_review](/last_review) - Último Álbum Review\n\n[/casts](/casts) - Últimos 5 Programas\n\n[/reviews](/reviews) - Últimos 5 Álbum Review\n\n"
	let id = msg.from.id;
	let reply = msg.message_id;
	let type = self.type;
	let parse = 'markdown';
	return bot.sendMessage(id, commands, { reply, parse });
});

bot.on(['/subscribe', '/start'], msg => {

  	let fromId = msg.from.id;
  	let firstName = msg.from.first_name;
  	let reply = msg.message_id;

  	var user = {user_id : fromId, user_name : firstName};
  	userController.insert(user, function(result, dbError) {
  		if (dbError) {
			return bot.sendMessage(fromId, `Bem vindo de volta!`, { reply });
		}
		else {
			return bot.sendMessage(fromId, `Saudações Musiqueiro!`, { reply });
			console.log('Success! Item inserted');
		}
	});
});

bot.on('/unsubscribe', msg => {
	let fromId = msg.from.id;
  	let reply = msg.message_id;

  	userController.delete(fromId, function(result, dbError) {
  		if (dbError) {
			return bot.sendMessage(fromId, `Comando Inválido. Parece que você ainda não assinou o nosso feed`, { reply });
		}
		else {
			return bot.sendMessage(fromId, `Até mais musiqueiro e tenha uma boa vida!`, { reply });
			console.log('Success! Item inserted');
		}
  	});
});

bot.on('/last_cast', msg => {
	podcastsController.getLastPodcast(function(result, dbError) {
		if (dbError) {
			return bot.sendMessage(msg.from.id, "Foi mal musiqueiro, alguma coisa deu errada");
		}
		else {
			return bot.sendMessage(msg.from.id, result[0].post_url);
		}
	})
});

bot.on('/last_review', msg => {
	podcastsController.getLastReview(function(result, dbError) {
		if (dbError) {
			return bot.sendMessage(msg.from.id, "Foi mal musiqueiro, alguma coisa deu errada");
		}
		else {
			return bot.sendMessage(msg.from.id, result[0].post_url);
		}
	})
});

bot.on('/casts', msg => {
	podcastsController.getShows(function(result, dbError) {
		if (dbError) {
			return bot.sendMessage(msg.from.id, "Foi mal musiqueiro, alguma coisa deu errada");
		}
		else {
			sendCasts(msg.from.id, 0, result);
		}
	return true;
	});
});

bot.on('/reviews', msg => {
	podcastsController.getReviews(function(result, dbError) {
		if (dbError) {
			return bot.sendMessage(msg.from.id, "Foi mal musiqueiro, alguma coisa deu errada");
		}
		else {
			console.log(result);
			sendCasts(msg.from.id, 0, result);
		}
	return true;
	});
});

/***************** </TELEGRAM> *********************/

var sendCasts = function(user, index, casts) {
	if (index < casts.length) {
		bot.sendMessage(user, casts[index].post_url);

		setTimeout(function() {
			sendCasts(user, index + 1, casts);
		}, 200)
	}
	return;
};

var sendPushNotification = function(link) {
	userController.getAll(function(result, dbError) {
		if (dbError) {
			console.log('DB Error! Cannot perform query.');
		}
		else {
			result.forEach( function(element, index) {
				setTimeout(function() {
					bot.sendMessage(element.user_id, link);
				}, 50);
			});
		}
	});
};

module.exports = {
	sendShow : sendPushNotification
};
