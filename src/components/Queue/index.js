import React, { useState } from 'react';

import { Row, Col, Typography } from 'antd';

import PageVisibility from 'react-page-visibility';

// import { SortableContainer } from 'react-sortable-hoc';

// import arrayMove from 'array-move';

import LoadingQueue from './LoadingQueue';
import ComingUp from './ComingUp';
// import JustQueued from './JustQueued';

import { useRequests } from '../../hooks';

const { Title } = Typography;

const Queue = () => {
  const [pageIsVisible, setPageIsVisible] = useState(true);
  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible);
  };
  const requests = useRequests();

  // Show a skeleton while requests load
  if (!requests.loaded) {
    return <LoadingQueue />;
  }

  // const justQueuedRequest = requests.played
  //   .find(() => {
  //     return true;
  //   }); // TODO: only show if it was queued within the last 10 minutes

  return (
    <Row
      type="flex"
      style={{
        paddingBottom: '80px',
        flexGrow: '1',
      }}
    >
      <Col
        flex={1}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageVisibility onChange={handleVisibilityChange}>
          <>
            {
              // <JustQueued
              //   request={justQueuedRequest}
              //   pageIsVisible={pageIsVisible}
              // />
            }
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
            <ComingUp pageIsVisible={pageIsVisible} />
          </>
        </PageVisibility>
      </Col>
    </Row>
  );
};

export default Queue;
