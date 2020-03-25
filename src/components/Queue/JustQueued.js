import React from 'react';

import {
  Row,
  Typography,
} from 'antd';

import QueueItem from '../QueueItem';

const { Title } = Typography;

const JustQueued = props => {
  const {
    request,

  } = props;

  if (!request) {
    return null;
  }

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
      <QueueItem
        {...props}
      />
    </>
  );
};

export default JustQueued
