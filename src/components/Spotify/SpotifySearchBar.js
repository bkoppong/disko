import React, {
  useState,
  useCallback,
} from 'react';

import {
  debounce,
} from 'throttle-debounce';

import {
  isLoaded,
} from 'react-redux-firebase';

import {
  Input,
  Col,
  List,
  Typography,
} from 'antd';

import {
  Search,
  X,
} from 'react-feather';

import Img from 'react-image';

import {
  withSpotify,
} from './spotify';

const SpotifySearchBar = ({
  spotify,
  handleSpotifyAction,
  handleSpotifyError,
  onSelectResult,
  disabled,
  updateSearchData,
  ...rest
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

  const searchQuery = async (searchString) => {
    try {
      if (!searchString) {
        return updateSearchData({
          searchEnabled: true,
          searchLoading: false,
          searchResults: [],
        });
      }
      const newSearchResults = await handleSpotifyAction('searchTracks', searchString);

      if (newSearchResults instanceof Error) {
        throw newSearchResults;
      }

      const trackRender = renderTrackResults(newSearchResults.tracks.items)
      updateSearchData({
        searchEnabled: true,
        searchLoading: false,
        searchResults: trackRender,
      });
    } catch (error) {
      console.error(error);
      handleEndSearch();
    }
  };

  const debouncedSearchQuery = useCallback(debounce(350, searchQuery), []);

  const handleChange = (event) => {
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

  const handleBlur = (event) => {
    event.persist();
    if (!event.target.value) {
      handleEndSearch();
    }
  };

  const renderTrackResults = (searchResults) => {

    return searchResults.map((track) => {

      const handleSelectResult = () => {
        handleEndSearch();
        onSelectResult(track);
      };

      const trackName = track.name;
      const primaryArtistName = track.artists[0].name;
      const albumName = track.album.name;
      const albumReleaseDate = track.album.release_date;

      const albumArtworkRefs = track.album.images;

      const albumArtworkUrl = albumArtworkRefs.sort((a, b) => {
        return a.height - b.height;
      })[0].url;

      const trackDuration = track.duration_ms;
      const explicitRating = track.explicit;

      const trackSpotifyUri = track.uri;

      return (
          <List.Item
            key={trackSpotifyUri}
            onClick={handleSelectResult}
            style={{
              // overflow: 'hidden',
              alignItems: 'stretch',
            }}
          >
            <Col
              style={{
                maxHeight: '100%',
                display: 'flex',
              }}>
              <Img
                src={albumArtworkUrl}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Col>
            <Col
              style={{
              display: 'flex',
              flexGrow: '1',
              // width: '100%',
              marginLeft: '14px',
              // marginRight: '14px',
              overflow: 'hidden',
              alignItems: 'middle',
            }}>
              <Typography.Text
                style={{
                  fontWeight: '600',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: '100%',
                  maxWidth: '100%',
                  position: 'relative',
                  top: '-10%',
                }}
              >
                {trackName}
              </Typography.Text>
              <Typography.Text
                style={{
                  fontWeight: '600',
                  fontSize: '.6em',
                  color: '#ccc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: '100%',
                  position: 'absolute',
                  bottom: '-10%',
                }}
              >
                {primaryArtistName}
              </Typography.Text>
            </Col>
          </List.Item>
      );
    });
  };

  const renderSuffix = () => {
    if (!inputValue) {
      return null;
    }
    return (
      <X
        size={17}
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
          size={17}
          style={{
            marginLeft: '-4px',
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
