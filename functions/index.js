'use strict';

const functions = require('firebase-functions');

const {
	asyncRefreshSpotifyGuestToken,
	asyncRefreshSpotifyHostToken,
	spotifyToken,
	spotifyRedirect,
	asyncGenerateNewRoom,
} = require('./src');

module.exports = {
	asyncRefreshSpotifyGuestToken: functions.https.onCall(
		asyncRefreshSpotifyGuestToken,
	),
	asyncRefreshSpotifyHostToken: functions.https.onCall(
		asyncRefreshSpotifyHostToken,
	),
	asyncGenerateNewRoom: functions.https.onCall(asyncGenerateNewRoom),
	spotifyToken: functions.https.onRequest(spotifyToken),
	spotifyRedirect: functions.https.onRequest(spotifyRedirect),
};
