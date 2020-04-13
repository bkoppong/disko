import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { Affix, Row } from 'antd';

import { debounce } from 'throttle-debounce';

import { useSpotify } from '../../hooks';

import { updateSearchData, endSearch } from '../../redux/actions';

import SearchInput from './SearchInput';

const SearchBar = () => {
  // console.log('search bar render');
  const spotify = useSpotify();

  const dispatch = useDispatch();
  const update = useCallback(
    (updateObject) => {
      dispatch(updateSearchData(updateObject));
    },
    [dispatch],
  );
  const end = useCallback(() => {
    dispatch(endSearch());
  }, [dispatch]);

  const handleFocus = () => {
    update({
      searchEnabled: true,
    });
  };
  const handleBlur = (event) => {
    event.persist();
    if (!event.target.value) {
      end();
    }
  };

  const searchQuery = useCallback(
    async (searchString) => {
      try {
        if (!searchString) {
          return update({
            searchEnabled: true,
            searchLoading: false,
            searchResults: null,
          });
        }
        // for multiple providers, would do this in a foreach
        const newSearchResults = await spotify.searchTracks(searchString);

        const searchResults = newSearchResults.tracks.items;
        update({
          searchEnabled: true,
          searchLoading: false,
          searchResults: searchResults,
        });
      } catch (error) {
        console.error(error);
        // end();
      }
    },
    [spotify, update],
  );

  const debouncedSearchQuery = useCallback(debounce(350, searchQuery), [
    searchQuery,
  ]);

  const handleChange = useCallback(
    (event) => {
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
        // end();
      }
    },
    [end, update, debouncedSearchQuery],
  );

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
        <SearchInput
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Row>
    </Affix>
  );
};

export default React.memo(SearchBar);
