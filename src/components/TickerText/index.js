import React, { useState, useEffect } from 'react';

import Ticker from 'react-ticker';

import { OverflowDetector } from 'react-overflow';

import { Typography } from 'antd';

const TickerText = (props) => {
  const { text, pageIsVisible } = props;

  const [overflow, setOverflow] = useState(false);
  const [tickerMoving, setTickerMoving] = useState(false);

  const handleOverflowChange = (isOverflowed) => {
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

export default TickerText;
