'use strict';

const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const { Spotify, OAUTH_SCOPES } = require('../resources');

/**
 * Redirects the User to the Spotify authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */

const spotifyRedirect = (req, res) => {
	cookieParser()(req, res, () => {
		const state =
			req.cookies.state || crypto.randomBytes(20).toString('hex');
		console.log('Setting verification state:', state);
		res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.cookie('__session', state.toString(), {
			maxAge: 3600000,
			secure: true,
			httpOnly: true,
			// sameSite: 'None'
		});
		const authorizeURL = Spotify.createAuthorizeURL(
			OAUTH_SCOPES,
			state.toString(),
		);
		res.redirect(authorizeURL);
	});
};

module.exports = {
	spotifyRedirect,
};
