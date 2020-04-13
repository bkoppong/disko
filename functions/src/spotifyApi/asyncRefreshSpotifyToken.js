'use strict';

const { admin, Spotify } = require('../resources');

const asyncRefreshSpotifyGuestToken = async () => {
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

const asyncRefreshSpotifyToken = async (data, context) => {
	try {
		const { auth } = context;
		console.log(auth);
		if (!(auth && auth.uid && !auth.isAnonymous)) {
			return await asyncRefreshSpotifyGuestToken();
		}

		const uid = auth.uid;

		const hostRef = admin
			.firestore()
			.collection('hosts')
			.doc(uid);

		const spotifyProviderRef = hostRef
			.collection('providers')
			.doc('spotify');

		const profileSnapTask = hostRef.get();
		const providerSnapTask = spotifyProviderRef.get();

		const taskResults = await Promise.all([
			profileSnapTask,
			providerSnapTask,
		]);

		const profileSnap = taskResults[0];
		const providerSnap = taskResults[1];

		if (!profileSnap.exists) {
			throw new Error('Profile does not exist.');
		}

		if (!providerSnap.exists) {
			throw new Error('This host has not registered any providers.');
		}

		const profileData = profileSnap.data();
		const providerData = providerSnap.data();

		console.log(profileData);
		console.log(providerData);

		const { accessToken, refreshToken, expiresIn } = providerData;

		if (
			!(
				(accessToken && refreshToken && expiresIn)
				// profileData.providers.spotify.refreshTimestamp
			)
		) {
			throw new Error('Access or Refresh tokens not set.');
		}

		Spotify.setRefreshToken(refreshToken);

		const data = await Spotify.refreshAccessToken();

		if (data.error) {
			// TODO: Host needs to reauthenticate with spotify
			// throw an error
		}

		const renewedAccessToken = data.body['access_token'];
		const renewedRefreshToken = data.body['refresh_token'];

		let spotifyProviderUpdateObject = {
			accessToken: renewedAccessToken,
			refreshTimestamp: admin.firestore.FieldValue.serverTimestamp(),
		};

		if (renewedRefreshToken) {
			spotifyProviderUpdateObject.refreshToken = renewedRefreshToken;
		}

		await spotifyProviderRef.update(spotifyProviderUpdateObject);

		return {
			accessToken: renewedAccessToken,
		};
	} catch (error) {
		console.error(error);
		return {
			error,
		};
	}
};

module.exports = {
	asyncRefreshSpotifyToken,
};
