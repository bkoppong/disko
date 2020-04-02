import React from 'react';

import { Row, Typography, List } from 'antd';

import QueueItem from '../QueueItem';

const { Title } = Typography;

const JustQueued = props => {
  const { request } = props;

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
      <List size="small">
        <QueueItem {...props} />
      </List>
    </>
  );
};

export default JustQueued;
