const express = require('express');
const router = express.Router();
const requestIP = require('request-ip');

//Rendering the index home page
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('index');
});

//Rendering the profile's page
router.get('/profile', ensureAuthenticated, function(req, res) {
	res.render('profile');
});

//Rendering the about.json, describing the services and widget
router.get('/about.json', function(req, res) {
	const ip = requestIP.getClientIp(req).split(':')[3];
	const time = (new Date).getTime();
	about = {
		client: {
			host: ip
		},
		server: {
			current_time: time,
			services: [{
				name: "weather",
				widgets: [{
					name: "city_temperature",
					description: "Affichage de la température sur une ville",
					params: [{
						name: "city",
						type: "string"
					}]
				}, {
					name: "city_climate",
					description: "Affichage du temps sur une ville",
					params: [{
						name: "city",
						type: "string"
					}]
				}]
			}, {
				name: "clashRoyale",
				widgets: [{
					name: "player_next_chest",
					description: "Affichage du type du prochain coffre",
					params: [{
						name: "tag",
						type: "string"
					}]
				}]
			}, {
				name: "twitch",
				widgets: [{
					name: "followed_channel_followers_number",
					description: "Affichage du nombre de followers d'une chaîne suivie",
					params: [{
						name: "channel",
						type: "string"
					}]
				}]
			}, {
				name: "steam",
				widgets: [{
					name: "game_time_played",
					description: "Affichage du temps joué sur un jeu",
					params: [{
						name: "game",
						type: "string"
					}]
				}]
			}, {
				name: "LeMonde",
				widgets: [{
					name: "news_by_keyword",
					description: "Affichage de la dernière nouvelle en rapport avec le mot clé",
					params: [{
						name: "keyword",
						type: "string"
					}]
				}]
			}]
		}
	} 
	res.send(about);
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;