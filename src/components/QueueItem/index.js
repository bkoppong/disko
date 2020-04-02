import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types'
// import { useFirestore } from 'react-redux-firebase';

import { OverflowDetector } from 'react-overflow';
import Ticker from 'react-ticker';

// import { SortableElement } from 'react-sortable-hoc';
import Img from 'react-image';

import './index.css';

import { List, Typography, Col } from 'antd';

const QueueItem = props => {
  const { request, pageIsVisible } = props;

  let { actions } = props;

  actions = actions || [null];

  const track = request.trackData;

  const trackName = track.name;
  const primaryArtistName = track.artists[0].name;
  // const albumName = track.album.name;
  // const albumReleaseDate = track.album.release_date;

  const albumArtworkRefs = track.album.images;

  const albumArtworkUrl = albumArtworkRefs.sort((a, b) => {
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

  return (
    <List.Item
      actions={actions}
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
      <Typography.Text
        style={{
          fontWeight: '600',
          fontSize: '.6em',
          color: displayNameColor,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          position: 'absolute',
          right: '0px',
          bottom: '0px',
          lineHeight: 'initial',
          paddingBottom: '17px',
        }}
      >
        {displayName}
      </Typography.Text>
    </List.Item>
  );
};

const TickerText = props => {
  const { text, pageIsVisible } = props;

  const [overflow, setOverflow] = useState(false);
  const [tickerMoving, setTickerMoving] = useState(false);

  const handleOverflowChange = isOverflowed => {
    setOverflow(isOverflowed);
  };

  useEffect(() => {
    const tickerDelay = setTimeout(() => {
      setTickerMoving(overflow);
    }, 4000);

    return () => {
      clearTimeout(tickerDelay);
    };
  }, [overflow]);

  if (!pageIsVisible) {
    return null;
  }

  return (
    <Ticker
      mode="await"
      speed={1}
      move={tickerMoving}
      style={{
        position: 'absolute',
        height: '100%',
        // width: '100%',
      }}
    >
      {() => (
        <OverflowDetector
          onOverflowChange={handleOverflowChange}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            position: 'absolute',
          }}
        >
          <Typography.Text
            style={{
              fontWeight: '600',
              color: 'white',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: '100%',
              position: 'relative',
              top: '-10%',
            }}
          >
            {text}
          </Typography.Text>
        </OverflowDetector>
      )}
    </Ticker>
  );
};

export default QueueItem;
