import React, { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';

import { Affix, Row, Input } from 'antd';

import { Search, X } from 'react-feather';
import { debounce } from 'throttle-debounce';

import { withSpotify } from '../Spotify';

// import {
//   GUEST_PROVIDERS_REFERENCE,
// } from '../../constants';

import { updateSearchData, endSearch } from '../../redux/actions';

const SearchBar = props => {
  const { handleSpotifyAction } = props;

  const auth = useSelector(state => state.firebase.auth);
  const disabled = !isLoaded(auth) || isEmpty(auth);

  const searchData = useSelector(state => state.search);
  const { inputValue } = searchData;

  const dispatch = useDispatch();
  const update = updateObject => {
    dispatch(updateSearchData(updateObject));
  };
  const end = () => {
    dispatch(endSearch());
  };

  // const guestProviders = useSelector(
  //   state => state.firestore.ordered[GUEST_PROVIDERS_REFERENCE],
  // );
  // let guestProvidersMap = {};
  //
  // if (isLoaded(guestProviders) && !isEmpty(guestProviders)) {
  //   guestProvidersMap = guestProviders.reduce((map, provider) => {
  //     map[provider.name] = provider;
  //     return map;
  //   }, {});
  // }

  const handleFocus = () => {
    update({
      searchEnabled: true,
    });
  };

  const handleBlur = event => {
    event.persist();
    if (!event.target.value) {
      end();
    }
  };

  const renderSuffix = () => {
    if (!inputValue) {
      return null;
    }
    return (
      <X
        size={12}
        style={{
          transform: 'scale(1.4)',
          // marginLeft: '-4px',
          // marginRight: '4px',
        }}
        onClick={end}
      />
    );
  };

  const searchQuery = async searchString => {
    try {
      if (!searchString) {
        return update({
          searchEnabled: true,
          searchLoading: false,
          searchResults: null,
        });
      }
      // for multiple providers, would do this in a foreach
      const newSearchResults = await handleSpotifyAction(
        'searchTracks',
        searchString,
      );

      if (newSearchResults instanceof Error) {
        throw newSearchResults;
      }

      const searchResults = newSearchResults.tracks.items;
      update({
        searchEnabled: true,
        searchLoading: false,
        searchResults: searchResults,
      });
    } catch (error) {
      console.error(error);
      end();
    }
  };

  const debouncedSearchQuery = useCallback(debounce(350, searchQuery), []);

  const handleChange = event => {
    try {
      event.persist();
      if (event.target !== document.activeElement) {
        end();
      }
      const updateInputValue = event.target.value;
      update({
        inputValue: updateInputValue,
        searchLoading: true,
        searchResults: [],
      });
      return debouncedSearchQuery(event.target.value);
    } catch (error) {
      console.error(error);
      end();
    }
  };

  return (
    <Affix>
      <Row
        style={{
          zIndex: '1',
          paddingTop: '10px',
          paddingBottom: '15px',
          height: '55px',
          backgroundColor: '#191414',
        }}
      >
        <Input
          id="disko_search_bar"
          onChange={handleChange}
          value={inputValue}
          placeholder="Queue a song..."
          maxLength={40}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          prefix={
            <Search
              size={12}
              style={{
                transform: 'scale(1.4)',
                // marginLeft: '-4px',
                marginRight: '4px',
              }}
            />
          }
          suffix={renderSuffix()}
          style={{
            width: '100%',
          }}
        />
      </Row>
    </Affix>
  );
};

export default withSpotify(SearchBar);

// <SpotifySearchBar
//   guestProviderInfo={guestProvidersMap.spotify}
//   disabled={disabled}
//   {...props}
// />
