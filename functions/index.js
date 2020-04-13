'use strict';

const functions = require('firebase-functions');

const {
	asyncRefreshSpotifyToken,
	spotifyToken,
	spotifyRedirect,
	asyncGenerateNewRoom,
	asyncUpdateAnonymousUsername,
} = require('./src');

module.exports = {
	asyncRefreshSpotifyToken: functions.https.onCall(asyncRefreshSpotifyToken),
	asyncGenerateNewRoom: functions.https.onCall(asyncGenerateNewRoom),
	asyncUpdateAnonymousUsername: functions.auth
		.user()
		.onCreate(asyncUpdateAnonymousUsername),
	spotifyToken: functions.https.onRequest(spotifyToken),
	spotifyRedirect: functions.https.onRequest(spotifyRedirect),
};
