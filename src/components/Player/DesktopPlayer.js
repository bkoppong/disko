import React from 'react';

// import { SpotifyWebPlaybackSDK } from '../Spotify'; // TODO: Turn into hook

import PlayerController from './PlayerController';

import { useSpotifyQueue, useSpotify } from '../../hooks';

const DesktopPlayer = () => {
  useSpotifyQueue();
  const spotify = useSpotify();

  if (!spotify) {
    return null;
  }

  return <PlayerController />;
};

// <SpotifyWebPlaybackSDK
//   spotify={spotify}
//   callback={state => console.log(state)}
// />

export default DesktopPlayer;
