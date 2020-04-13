import React from 'react';
// import PropTypes from 'prop-types'
// import { useFirestore } from 'react-redux-firebase';

// import { SortableElement } from 'react-sortable-hoc';

import Img from 'react-image';

import './index.css';

import { List, Typography, Col } from 'antd';

import TickerText from '../TickerText';

import { Lock } from 'react-feather';

const QueueItem = ({ request, pageIsVisible, actions }) => {
  const actionsList = !request.queued && actions ? actions : [null];

  const track = request.trackData;

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
  const trackSpotifyUrl = track.external_urls.spotify;
  // console.log(trackSpotifyUrl);

  const displayName = request.displayName || 'anonymous';
  const isAnonymous = request.isAnonymous;

  const displayNameColor = isAnonymous ? '#ccc' : '#1DB954';

  const lockedInQueueOverlay = request.queued ? (
    <div className="locked_in_queue_overlay">
      <Lock />
    </div>
  ) : null;

  return (
    <List.Item
      actions={actionsList}
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
        <a href={trackSpotifyUrl} target="_blank" rel="noopener noreferrer">
          <Img src={albumArtworkUrl} />
          {lockedInQueueOverlay}
        </a>
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
        <TickerText text={trackName} pageIsVisible={pageIsVisible} />
        <Typography.Text
          style={{
            color: '#ccc',
            minWidth: '100%',
            position: 'absolute',
            bottom: '-10%',
            fontSize: '.6em',
          }}
        >
          {primaryArtistName}
        </Typography.Text>
      </Col>
      <Typography.Text
        style={{
          color: displayNameColor,
          position: 'absolute',
          right: '0px',
          bottom: '0px',
          lineHeight: 'initial',
          paddingBottom: '17px',
          fontSize: '.6em',
        }}
      >
        {displayName}
      </Typography.Text>
    </List.Item>
  );
};

export default QueueItem;
