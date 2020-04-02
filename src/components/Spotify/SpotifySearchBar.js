import React, { useState, useCallback } from 'react';

import { debounce } from 'throttle-debounce';

import { Input } from 'antd';

import { Search, X } from 'react-feather';

import { withSpotify } from './spotify';

const SpotifySearchBar = ({
  spotify,
  handleSpotifyAction,
  handleSpotifyError,
  onSelectResult,
  disabled,
  updateSearchData,
  // ...rest
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleEndSearch = useCallback(() => {
    setInputValue('');
    updateSearchData({
      searchEnabled: false,
      searchLoading: false,
      searchResults: false,
    });
  }, [updateSearchData]);

  const searchQuery = async searchString => {
    try {
      if (!searchString) {
        return updateSearchData({
          searchEnabled: true,
          searchLoading: false,
          searchResults: null,
        });
      }
      const newSearchResults = await handleSpotifyAction(
        'searchTracks',
        searchString,
      );

      if (newSearchResults instanceof Error) {
        throw newSearchResults;
      }

      const searchResults = newSearchResults.tracks.items.map(track => {
        const handleSelectResult = () => {
          handleEndSearch();
          onSelectResult();
        };
        return {
          track,
          handleSelectResult,
        };
      });
      updateSearchData({
        searchEnabled: true,
        searchLoading: false,
        searchResults: searchResults,
      });
    } catch (error) {
      console.error(error);
      handleEndSearch();
    }
  };

  const debouncedSearchQuery = useCallback(debounce(350, searchQuery), []);

  const handleChange = event => {
    try {
      event.persist();
      if (event.target !== document.activeElement) {
        handleEndSearch();
      }
      setInputValue(event.target.value);
      updateSearchData({
        searchLoading: true,
        searchResults: [],
      });
      return debouncedSearchQuery(event.target.value);
    } catch (error) {
      console.error(error);
      handleEndSearch();
    }
  };

  // const getHandleSelectResult = useCallback((track) => () => {
  //   console.log(onSelectResult)
  //   handleEndSearch();
  //   onSelectResult(track);
  // }, [onSelectResult, handleEndSearch]);

  const handleFocus = () => {
    updateSearchData({
      searchEnabled: true,
    });
  };

  const handleBlur = event => {
    event.persist();
    if (!event.target.value) {
      handleEndSearch();
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
        onClick={handleEndSearch}
      />
    );
  };

  return (
    <Input
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
  );
};

export default withSpotify(SpotifySearchBar);
