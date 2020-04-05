'use strict';

const { admin } = require('./resources');
const {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} = require('unique-names-generator');

const config = {
	separator: '',
	dictionaries: [adjectives, colors, animals],
	length: 3,
	style: 'capital',
};

const asyncUpdateAnonymousUsername = async user => {
	try {
		const displayName = uniqueNamesGenerator(config);
		console.log(user);
		const userObject = {
			displayName: displayName,
		};
		const updatedUser = await admin
			.firestore()
			.collection('guests')
			.doc(user.uid)
			.set(userObject);
		console.log(updatedUser);
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	asyncUpdateAnonymousUsername,
};
