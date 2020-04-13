import React, { lazy } from 'react';
import { useSelector } from 'react-redux';

import { Affix, Col } from 'antd';

import { useHostProviderInfo, useRoom } from '../../hooks';

const Player = lazy(() => import('../Player'));
const RoomCurrentlyPlaying = lazy(() => import('./RoomCurrentlyPlaying'));

const RoomFooter = () => {
  const auth = useSelector((state) => state.firebase.auth);
  const { hostUid } = useRoom();
  const { accessToken } = useHostProviderInfo();

  const player = accessToken && hostUid === auth.uid ? <Player /> : null;

  return (
    <Affix
      offsetBottom={0}
      style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
      }}
    >
      <Col>
        <RoomCurrentlyPlaying />
        {player}
      </Col>
    </Affix>
  );
};

export default RoomFooter;
