import React from 'react';

import { SpotifySearchBar } from '../Spotify';

const SearchBar = props => {
  const { guestProviders, hostProviders } = props;

  let guestProvidersMap = {};
  let hostProvidersMap = {};

  if (hostProviders) {
    hostProvidersMap = hostProviders.reduce((map, provider) => {
      map[provider.name] = provider;
      return map;
    }, {});
  } else {
    guestProvidersMap = guestProviders.reduce((map, provider) => {
      map[provider.name] = provider;
      return map;
    }, {});
  }

  return (
    <SpotifySearchBar
      hostProviderInfo={hostProvidersMap.spotify}
      guestProviderInfo={guestProvidersMap.spotify}
      {...props}
    />
  );
};

export default SearchBar;
