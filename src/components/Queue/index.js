import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useFirestoreConnect,
  isLoaded,
} from 'react-redux-firebase';

import {
  Row,
  Typography,
} from 'antd';

import PageVisibility from 'react-page-visibility';

// import { SortableContainer } from 'react-sortable-hoc';

// import arrayMove from 'array-move';

import LoadingQueue from './LoadingQueue';
import ComingUp from './ComingUp';
import JustQueued from './JustQueued';

const { Title } = Typography;

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

  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible)
  };

  // Attach requests listener
  useFirestoreConnect(requestsQuery);
  // Get requests from redux state
  let requests = useSelector(state => state.firestore.ordered[requestsReference]);
  // Show a skeleton while requests load
  if (!isLoaded(requests)) {
    return <LoadingQueue />;
  }


  const justQueuedRequest = requests
    .filter(request => request.queueTimestamp)
    .sort((a, b) => {
      return b.queueTimestamp.seconds - a.queueTimestamp.seconds;
    }).find(() => {return true}); // TODO: only show if it was queued within the last 10 minutes



  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <>
        <JustQueued
          request={justQueuedRequest}
          pageIsVisible={pageIsVisible}
          {...props}
        />
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
        <ComingUp
          requests={requests}
          pageIsVisible={pageIsVisible}
          {...props}
        />
      </>
    </PageVisibility>
  );
}

export default Queue;
