import React from 'react';

import { useSelector } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';

import { SpotifySearchBar } from '../Spotify';

import {
  GUEST_PROVIDERS_REFERENCE,
  // HOST_PROVIDERS_REFERENCE,
} from '../../constants';

const SearchBar = props => {
  // const { room } = props;

  // const hostProviders = useSelector(
  //   state => state.firestore.ordered[HOST_PROVIDERS_REFERENCE],
  // );
  const guestProviders = useSelector(
    state => state.firestore.ordered[GUEST_PROVIDERS_REFERENCE],
  );

  // const allowedProviders = room.hostProviders;

  let guestProvidersMap = {};
  // let hostProvidersMap = {};

  // if (hostProviders) {
  //   hostProvidersMap = hostProviders.reduce((map, provider) => {
  //     map[provider.name] = provider;
  //     return map;
  //   }, {});
  // } else if (guestProviders) {
  //   guestProvidersMap = guestProviders.reduce((map, provider) => {
  //     map[provider.name] = provider;
  //     return map;
  //   }, {});
  // }

  if (isLoaded(guestProviders) && !isEmpty(guestProviders)) {
    guestProvidersMap = guestProviders.reduce((map, provider) => {
      map[provider.name] = provider;
      return map;
    }, {});
  }

  return (
    <SpotifySearchBar
      guestProviderInfo={guestProvidersMap.spotify}
      {...props}
    />
  );
};

export default SearchBar;
