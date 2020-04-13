import React from 'react';

import PlayerController from './PlayerController';

import {
  useCurrentPlaybackMonitor,
  useSpotifyPlaylist,
  useSpotify,
} from '../../hooks';

const MobilePlayer = () => {
  useCurrentPlaybackMonitor();

  const {
    uri: playlistUri,
    // songs: playlistSongs,
  } = useSpotifyPlaylist();

  const spotify = useSpotify();

  if (!playlistUri || !spotify.getAccessToken()) {
    return null;
  }

  return <PlayerController />;
};

export default MobilePlayer;
