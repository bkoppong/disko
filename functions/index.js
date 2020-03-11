'use strict'

const functions = require('firebase-functions')

const {
  asyncGetSpotifyAccessToken,
  asyncRefreshSpotifyAccessToken,
  spotifyToken,
  spotifyRedirect,
  asyncGenerateNewRoom
} = require('./src')

module.exports = {
  asyncGetSpotifyAccessToken: functions.https.onCall(
    asyncGetSpotifyAccessToken
  ),
  asyncRefreshSpotifyAccessToken: functions.https.onCall(
    asyncRefreshSpotifyAccessToken
  ),
  asyncGenerateNewRoom: functions.https.onCall(asyncGenerateNewRoom),
  spotifyToken: functions.https.onRequest(spotifyToken),
  spotifyRedirect: functions.https.onRequest(spotifyRedirect)
}
