'use strict';

const { asyncGetSpotifyAccessToken } = require('./asyncGetSpotifyAccessToken');
const {
	asyncRefreshSpotifyAccessToken,
} = require('./asyncRefreshSpotifyAccessToken');
const { spotifyToken } = require('./spotifyToken');
const { spotifyRedirect } = require('./spotifyRedirect');

module.exports = {
	asyncGetSpotifyAccessToken,
	asyncRefreshSpotifyAccessToken,
	spotifyToken,
	spotifyRedirect,
};
