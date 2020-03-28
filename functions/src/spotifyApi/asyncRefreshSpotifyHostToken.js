'use strict';

const { admin, Spotify } = require('../resources');

const asyncRefreshSpotifyHostToken = async (data, context) => {
	try {
		if (!(context.auth && context.auth.uid)) {
			throw new Error('User not authorized with spotify yet.');
		}

		const uid = context.auth.uid;

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

		await spotifyProviderRef.update({
			accessToken: renewedAccessToken,
			refreshTimestamp: admin.firestore.FieldValue.serverTimestamp(),
		});

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
	asyncRefreshSpotifyHostToken,
};
