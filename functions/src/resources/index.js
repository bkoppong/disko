'use strict';

const { Spotify, OAUTH_SCOPES } = require('./spotify');

const { admin, createFirebaseAccount } = require('./admin');

module.exports = {
	Spotify,
	OAUTH_SCOPES,
	admin,
	createFirebaseAccount,
};
