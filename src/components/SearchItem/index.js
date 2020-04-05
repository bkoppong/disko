import React from 'react';
// import PropTypes from 'prop-types'
// import { useFirestore } from 'react-redux-firebase';

// import { SortableElement } from 'react-sortable-hoc';
import Img from 'react-image';

import { List, Typography, Col } from 'antd';

import TickerText from '../TickerText';

const SearchItem = props => {
  const {
    track,
    handleSelectResult,
    // pageIsVisible
  } = props;

  const trackName = track.name;
  const primaryArtistName = track.artists[0].name;
  // const albumName = track.album.name;
  // const albumReleaseDate = track.album.release_date;

  const albumArtworkRefs = track.album.images;

  const albumArtworkUrl = albumArtworkRefs.slice().sort((a, b) => {
    return a.height - b.height;
  })[0].url;

  // const trackDuration = track.duration_ms;
  // const explicitRating = track.explicit;

  // const trackSpotifyUri = track.uri;
  // const trackSpotifyUrl = track.external_urls.spotify;
  // console.log(trackSpotifyUrl);

  return (
    <List.Item
      onClick={handleSelectResult}
      style={{
        // overflow: 'hidden',
        alignItems: 'stretch',
      }}
    >
      <Col
        style={{
          maxHeight: '100%',
        }}
      >
        <Img src={albumArtworkUrl} />
      </Col>
      <Col
        style={{
          // width: '100%',
          display: 'flex',
          flexGrow: '1',
          marginLeft: '14px',
          // marginRight: '14px',
          overflow: 'hidden',
          alignItems: 'middle',
        }}
      >
        <TickerText text={trackName} pageIsVisible />
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
};

export default SearchItem;
