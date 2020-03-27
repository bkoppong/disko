'use strict';

const { admin, Spotify } = require('../resources');

const asyncRefreshSpotifyAccessToken = async (data, context) => {
	try {
		if (!(context.auth && context.auth.uid)) {
			throw new Error('User not authorized with spotify yet.');
		}

		const uid = context.auth.uid;

		const hostRef = admin
			.firestore()
			.collection('hosts')
			.doc(uid);

		const profileSnap = await hostRef.get();

		if (!profileSnap.exists) {
			throw new Error('Profile does not exist.');
		}

		const profileData = profileSnap.data();

		if (
			!(
				profileData.providers &&
				profileData.providers.spotify &&
				profileData.providers.spotify.accessToken &&
				profileData.providers.spotify.refreshToken &&
				profileData.providers.spotify.refreshTimestamp &&
				profileData.providers.spotify.expiresIn
			)
		) {
			throw new Error('Access or Refresh tokens not set.');
		}

		Spotify.setRefreshToken(profileData.refreshToken);

		const data = await Spotify.refreshAccessToken();

		if (data.error) {
			// TODO: Host needs to reauthenticate with spotify
		}

		const accessToken = data.body['access_token'];

		await hostRef
			.collection('providers')
			.doc('spotify')
			.update({
				accessToken,
				refreshTimestamp: admin.firestore.FieldValue.serverTimestamp(),
			});

		return {
			accessToken,
		};
	} catch (error) {
		console.error(error);
		return {
			error,
		};
	}
};

module.exports = {
	asyncRefreshSpotifyAccessToken,
};
