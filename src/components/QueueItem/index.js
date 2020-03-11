import React, {
  useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types'
import { useFirestore } from 'react-redux-firebase';

import { OverflowDetector } from 'react-overflow';
import Ticker from 'react-ticker';

// import { SortableElement } from 'react-sortable-hoc';
import Img from 'react-image';

import './index.css';

import {
  List,
  Button,
  Typography,
  Col,
} from 'antd';

const QueueItem = props => {

  const {
    uid,
    request,
    roomId,
    pageIsVisible,
  } = props;

  const firestore = useFirestore();

  const arrayUnion = firestore.FieldValue.arrayUnion;
  const arrayRemove = firestore.FieldValue.arrayRemove;
  const increment = firestore.FieldValue.increment;

  const upvotes = request.upvotes ? request.upvotes : [];
  const upvotesCount = request.upvotesCount ? request.upvotesCount : 0;
  const upvoted = upvotes.includes(uid);

  let requestReference = firestore.collection(`rooms/${roomId}/requests`).doc(request.id);

  function toggleUpvoted() {

    if (upvoted) {
      requestReference.update({
        upvotes: arrayRemove(uid),
        upvotesCount: increment(-1),
      });
    } else {
      requestReference.update({
        upvotes: arrayUnion(uid),
        upvotesCount: increment(1),
      });
    }
  }

  // function deleteTodo() {
  //   return firestore.delete(`requests/${id}`)
  // }

  const buttonClass = upvoted ? "upvote-button-upvoted" : "upvote-button";

  const track = request.trackData;

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
      actions={[
        <Typography.Text style={{
            fontWeight: '600',
            color: 'white',
          }}>
          {upvotesCount}
        </Typography.Text>,
        <Button
          className={buttonClass}
          key="list-loadmore-edit"
          icon="up"
          onClick={toggleUpvoted}
        />
      ]}
      style={{
        // overflow: 'hidden',
        alignItems: 'stretch',
      }}
    >
      <Col style={{
          maxHeight: '100%',
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
          // width: '100%',
          display: 'flex',
          flexGrow: '1',
          marginLeft: '14px',
          // marginRight: '14px',
          overflow: 'hidden',
          alignItems: 'middle',
        }}
      >
        <TickerText
          text={trackName}
          pageIsVisible={pageIsVisible}
        />
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

const TickerText = props => {

  const {
    text,
    pageIsVisible,
  } = props;

  const [overflow, setOverflow] = useState(false);
  const [tickerMoving, setTickerMoving] = useState(false);

  const handleOverflowChange = (isOverflowed) => {
    setOverflow(isOverflowed);
  }

  useEffect(() => {

    const tickerDelay = setTimeout(() => {setTickerMoving(overflow)}, 4000);

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
      {
        () => (
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
        )
      }
    </Ticker>
  );

};

// TodoItem.propTypes = {
//   id: PropTypes.string.isRequired
// };

// const SortableQueueItem = SortableElement(({
//   key,
//   uid,
//   roomId,
//   request,
//   pageIsVisible,
// }) => {
//   return (
//     <QueueItem
//       key={key}
//       uid={uid}
//       roomId={roomId}
//       request={request}
//       pageIsVisible={pageIsVisible}
//     />
//   );
// });

export default QueueItem;
