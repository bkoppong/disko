'use strict';

const { Spotify, admin } = require('../resources');

const asyncRefreshSpotifyGuestToken = async (data, context) => {
	try {
		const response = await Spotify.clientCredentialsGrant();
		const body = response.body;
		const expiresIn = body['expires_in'];
		const accessToken = body['access_token'];
		// console.log('The access token expires in ' + expiresIn)
		// console.log('The access token is ' + accessToken)

		const providerRef = admin
			.firestore()
			.collection('providers')
			.doc('spotify');

		await providerRef.update({
			accessToken,
			expiresIn,
		});

		return {
			accessToken,
			expiresIn,
		};
	} catch (error) {
		console.error(error);
		return {
			error,
		};
	}
};

module.exports = {
	asyncRefreshSpotifyGuestToken,
};
