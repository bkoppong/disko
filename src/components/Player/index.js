import React from 'react';

import SpotifyPlayer from '../Spotify/SpotifyPlayer';

// const PROVIDER_NAMES = [
//   'spotify',
// ];

import './index.css';

const Player = props => {
  const { hostProviders } = props;

  const hostProvidersMap = hostProviders.reduce((map, provider) => {
    map[provider.name] = provider;
    return map;
  }, {});

  return (
    <SpotifyPlayer hostProviderInfo={hostProvidersMap.spotify} {...props} />
  );
};

export default Player;
