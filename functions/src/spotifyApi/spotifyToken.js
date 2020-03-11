'use strict'

const cookieParser = require('cookie-parser')

const { createFirebaseAccount, Spotify } = require('../resources')

const cors = require('cors')({
  origin: true,
  credentials: true
})

/**
 * Exchanges a given Spotify auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
 * 'callback' query parameter.
 */
const spotifyToken = (req, res) => {
  try {
    cors(req, res, () => {
      cookieParser()(req, res, () => {
        console.log('Received verification state:', req.cookies.__session)
        console.log('Received state:', req.query.state)
        if (!req.cookies.__session) {
          throw new Error(
            'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
          )
        } else if (req.cookies.__session !== req.query.state) {
          throw new Error('State validation failed')
        }
        console.log('Received auth code:', req.query.code)
        Spotify.authorizationCodeGrant(req.query.code, (error, data) => {
          if (error) {
            throw error
          }
          console.log('Received Access Token:', data.body['access_token'])
          Spotify.setAccessToken(data.body['access_token'])

          Spotify.getMe(async (error, userResults) => {
            if (error) {
              throw error
            }
            console.log('Auth code exchange result received:', userResults)
            // We have a Spotify access token and the user identity now.
            const expiresIn = data.body['expires_in']
            const accessToken = data.body['access_token']
            const refreshToken = data.body['refresh_token']
            const spotifyUserID = userResults.body['id']
            let profilePic = ''
            if (userResults.body['images'][0]) {
              profilePic = userResults.body['images'][0]['url']
            }
            const userName = userResults.body['display_name']
            const email = userResults.body['email']

            // Create a Firebase account and get the Custom Auth Token.
            const firebaseToken = await createFirebaseAccount(
              spotifyUserID,
              userName,
              profilePic,
              email,
              accessToken,
              expiresIn,
              refreshToken
            )
            // Serve an HTML page that signs the user in and updates the user profile.
            res.json({ token: firebaseToken })
          })
        })
      })
    })
  } catch (error) {
    console.error(error)
    return res.json({ error: error.message })
  }
}

module.exports = {
  spotifyToken
}
