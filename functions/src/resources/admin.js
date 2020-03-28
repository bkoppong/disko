'use strict';

const admin = require('firebase-admin');

const serviceAccount = require('./service-account.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
async function createFirebaseAccount(
	displayName,
	photoURL,
	email,
	providerInfo,
) {
	try {
		// The UID we'll assign to the user.
		// const uid = `spotify:${spotifyID}`
		//
		// console.log(uid)

		console.log(displayName);
		console.log(photoURL);
		console.log(email);

		let userObject = {
			displayName: displayName,
			email: email,
			emailVerified: true,
		};

		if (photoURL) {
			userObject.photoURL = photoURL;
		}

		// Save the access token to the Firestore Database.

		let userRecord;
		let uid;
		let authTask;
		let profileCreationTask;
		let providerTask;

		try {
			userRecord = await admin.auth().getUserByEmail(email);
			uid = userRecord.uid;
			// Update the user account.
			authTask = admin.auth().updateUser(uid, userObject);
		} catch (error) {
			// If user does not exists we create it.
			if (error.code === 'auth/user-not-found') {
				userRecord = await admin.auth().createUser(userObject);
				uid = userRecord.uid;
			}
		}

		if (!uid) {
			throw new Error('Something went wrong in creating an account.');
		}

		const hostDocRef = admin
			.firestore()
			.collection('hosts')
			.doc(uid);

		profileCreationTask = hostDocRef.set({}, { merge: true });

		const providerName = providerInfo.name;
		const providerData = providerInfo.data;

		providerTask = hostDocRef
			.collection('providers')
			.doc(providerName)
			.set(providerData, { merge: true });

		// Wait for all async tasks to complete, then generate and return a custom auth token.
		await Promise.all([authTask, profileCreationTask, providerTask]);
		// Create a Firebase custom auth token.
		const token = await admin.auth().createCustomToken(uid);
		console.log(
			'Created Custom token for EMAIL "',
			email,
			'" Token:',
			token,
		);
		return token;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

module.exports = {
	admin,
	createFirebaseAccount,
};
