'use strict'

const admin = require('firebase-admin')

const serviceAccount = require('./service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
})

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
async function createFirebaseAccount(
  spotifyID,
  displayName,
  photoURL,
  email,
  accessToken,
  expiresIn,
  refreshToken
) {
  try {
    // The UID we'll assign to the user.
    const uid = `spotify:${spotifyID}`

    console.log(uid)
    console.log(displayName)
    console.log(photoURL)
    console.log(email)
    console.log(accessToken)
    console.log(expiresIn)
    console.log(refreshToken)
    // Save the access token to the Firestore Database.

    const userProfileCreationTask = admin
      .firestore()
      .collection('hosts')
      .doc(uid)
      .set({
        accessToken,
        expiresIn,
        refreshTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        refreshToken
      })

    let userObject = {
      displayName: displayName,
      email: email,
      emailVerified: true
    }

    if (photoURL) {
      userObject.photoURL = photoURL
    }

    // Create or update the user account.
    const userCreationTask = admin
      .auth()
      .updateUser(uid, userObject)
      .catch(error => {
        // If user does not exists we create it.
        if (error.code === 'auth/user-not-found') {
          return admin.auth().createUser({
            uid: uid,
            currentRoomId: '',
            ...userObject
          })
        }
        throw error
      })

    // Wait for all async tasks to complete, then generate and return a custom auth token.
    await Promise.all([userCreationTask, userProfileCreationTask])
    // Create a Firebase custom auth token.
    const token = await admin.auth().createCustomToken(uid)
    console.log('Created Custom token for UID "', uid, '" Token:', token)
    return token
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  admin,
  createFirebaseAccount
}
