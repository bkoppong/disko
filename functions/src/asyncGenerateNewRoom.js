'use strict';

const randomWords = require('random-words');
const { admin } = require('./resources');

const asyncGenerateNewRoom = async (data, context) => {
	try {
		const { auth } = context;

		if (!auth || !auth.uid) {
			throw new Error('You are unauthorized to create a room!');
		}

		const { uid } = auth;

		const hostRef = admin
			.firestore()
			.collection('hosts')
			.doc(uid);

		const roomsRef = admin.firestore().collection('rooms');

		let possibleId;

		while (true) {
			possibleId = randomWords({ exactly: 1, maxLength: 5 });
			possibleId = possibleId[0].toUpperCase();

			const roomSnap = await roomsRef.doc(possibleId).get(); // eslint-disable-line no-await-in-loop

			if (!roomSnap.exists) {
				break;
			}
		}

		const hostDocSnapTask = hostRef.get();
		const hostProvidersSnapTask = hostRef.collection('providers').get();

		const taskResults = await Promise.all([
			hostDocSnapTask,
			hostProvidersSnapTask,
		]);

		const hostDocSnap = taskResults[0];
		const hostProvidersSnap = taskResults[1];

		if (!hostDocSnap.exists || hostProvidersSnap.empty) {
			throw new Error('Host provider data not found.');
		}

		let hostProviders = [];

		let hostDocData = hostDocSnap.data();
		hostProvidersSnap.forEach(doc => {
			const providerDocData = doc.data();
			hostProviders.push(providerDocData.name);
		});

		let roomCreationTask = roomsRef.doc(possibleId).set({
			hostUid: uid,
			hostProviders: hostProviders,
			guestUids: [],
			guestDisplayNames: [],
		});

		let hostUpdateTask = hostRef.update({
			currentRoomId: possibleId,
		});

		await Promise.all([roomCreationTask, hostUpdateTask]);

		return {
			message: 'Successful room creation',
		};
	} catch (error) {
		console.error(error);
		return {
			error,
		};
	}
};

module.exports = {
	asyncGenerateNewRoom,
};
