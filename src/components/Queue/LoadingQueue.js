import React from 'react';

import {
  List,
  Skeleton,
} from 'antd';

const LoadingQueue = props => {
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
};

export default LoadingQueue;
