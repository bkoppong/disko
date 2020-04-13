import React from 'react';

import { Row, Typography, List } from 'antd';

import QueueItem from '../QueueItem';

const { Title } = Typography;

const JustQueued = ({ request, pageIsVisible }) => {
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
        <div>
          <QueueItem request={request} pageIsVisible={pageIsVisible} />
        </div>
      </List>
    </>
  );
};

export default JustQueued;
