import React, { lazy, Suspense } from 'react';

import { useSelector } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';

// const PROVIDER_NAMES = [
//   'spotify',
// ];

import { HOST_PROVIDERS_REFERENCE } from '../../constants';

import './index.css';

const SpotifyPlayer = lazy(() => import('../Spotify/SpotifyPlayer'));

const Player = props => {
  const hostProviders = useSelector(
    state => state.firestore.ordered[HOST_PROVIDERS_REFERENCE],
  );

  if (!isLoaded(hostProviders) || isEmpty(hostProviders)) {
    return null;
  }

  const hostProvidersMap = hostProviders.reduce((map, provider) => {
    map[provider.name] = provider;
    return map;
  }, {});

  return (
    <Suspense fallback={null}>
      <SpotifyPlayer hostProviderInfo={hostProvidersMap.spotify} {...props} />
    </Suspense>
  );
};

export default Player;
