import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase';
import QueueItem from '../QueueItem';

import PageVisibility from 'react-page-visibility';

// import { SortableContainer } from 'react-sortable-hoc';

// import arrayMove from 'array-move';

import { Flipper, Flipped } from 'react-flip-toolkit';

import {
  Row,
  Col,
  Typography,
  List,
  Button,
  Skeleton,
  Empty,
} from 'antd';

import Img from 'react-image';

const { Title } = Typography;

// const SortableQueueList = SortableContainer(({
//   children,
//   loadMore,
//   roomId,
// }) => {
//
//
//
//   return (
//       <List
//         size="large"
//         bordered
//         loadMore={loadMore}
//       >
//         {children}
//       </List>
//   );
// });

const Queue = props => {

  const {
    roomId,
  } = props;

  const requestsReference = `rooms/${roomId}/requests`;

  const requestsQuery = {
    collection: `rooms/${roomId}/requests`,
    // orderBy: [
    //   ['upvotesCount', 'desc'],
    //   ['creationTimestamp', 'asc'],
    // ],
    // limit: limit,
    storeAs: requestsReference,
  };

  const uid = useSelector(state => state.firebase.auth.uid);

  const [limit, setLimit] = useState(5);
  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible)
  }

  // Attach todos listener
  useFirestoreConnect(requestsQuery)
  // firestore.setListener(requestsQuery);

  // Get todos from redux state
  let requests = useSelector(state => state.firestore.ordered[requestsReference]);

  const onLoadMore = () => {
    setLimit(
      limit + 5
    );
  };

  // map IDs from requests and check if present

  // Show a message while todos are loading
  if (!isLoaded(requests)) {
    return (
      <List
        size="small"
      >
        {
          [1, 2, 3].map(item => {
            return (
              <List.Item
                key={`skeleton_item_${item}`}
                style={{
                  maxHeight: '80px',
                }}>
                <Skeleton
                  avatar={{
                    shape: 'square',
                  }}
                  title={{
                    width: '55%',
                  }}
                  paragraph={false}
                >
                </Skeleton>
              </List.Item>
            );
          })
        }
      </List>
    );
  }

  let cleanedRequests = requests
    .filter(request => request.creationTimestamp
      && !request.fulfilled && !request.queued);

  let sortedCleanedResults = cleanedRequests
    .sort((a, b) => {
      let upvotesDifference = b.upvotesCount - a.upvotesCount;
      if (upvotesDifference) return upvotesDifference;
      return a.creationTimestamp.seconds - b.creationTimestamp.seconds;
    }).slice(0, limit);

  // const justPlayed = requests
  //   .filter(request => request.fulfillTimestamp)
  //   .sort((a, b) => {
  //     return b.fulfillTimestamp.seconds - a.fulfillTimestamp.seconds;
  //   }).find(() => {return true});
  const renderComingUp = () => {
    if (!sortedCleanedResults.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />; // TODO: Make more attractive, center
    }
    let flipKey = sortedCleanedResults.map(result => result.id).join('');

    const loadMore =
        isLoaded(requests) && !isEmpty(requests) && cleanedRequests.length > limit ? (
          <div
            style={{
              textAlign: 'center',
              margin: 8,
              height: 50,
              lineHeight: '40px',
            }}
          >
            <Button
              type="ghost"
              onClick={onLoadMore}
              style={{
                border: 'none',
                fontWeight: '600',
                color: 'white',
              }}
            >
              Load More
            </Button>
          </div>
        ) : null;
    return (
      <PageVisibility onChange={handleVisibilityChange}>
        <Flipper flipKey={flipKey}>
          <List
            size="small"
            loadMore={loadMore}
          >
            {
              sortedCleanedResults.map((request, index) =>
                <Flipped
                  key={request.id}
                  flipId={request.id}
                >
                  <div>
                    <QueueItem
                      disabled={true}
                      index={index}
                      key={`${index}_${request.id}`}
                      uid={uid}
                      roomId={roomId}
                      request={request}
                      pageIsVisible={pageIsVisible}
                    />
                  </div>

                </Flipped>
              )
            }
          </List>
        </Flipper>
      </PageVisibility>
    );
  };

  const justQueued = requests
    .filter(request => request.queueTimestamp)
    .sort((a, b) => {
      return b.queueTimestamp.seconds - a.queueTimestamp.seconds;
    }).find(() => {return true}); // TODO: only show if it was queued within the last 10 minutes

  const renderJustQueued = () => {
    if (!justQueued) {
      return null;
    }
    const track = justQueued.trackData;
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
      <>
        <Row>
          <Title
            level={4}
            style={{
              color: 'white',
            }}
          >
            Just Queued
          </Title>
        </Row>
        <Row>
          <List.Item
            key={trackSpotifyUri}
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
        </Row>
      </>
    );
  }



  return (
    <>
      {renderJustQueued()}
      <Row>
        <Title
          level={4}
          style={{
            color: 'white',
          }}
        >
          Coming Up
        </Title>
      </Row>
      {renderComingUp()}
    </>
  );
}

export default Queue;
