import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { useFirebase } from 'react-redux-firebase';

import { Row, Col, Button } from 'antd';

import Room from '../Room';
import LoadingPage from '../LoadingPage';

const HostRoomPage = (props) => {
  const profile = useSelector((state) => state.firebase.profile);

  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);

  const asyncGenerateNewRoom = firebase
    .functions()
    .httpsCallable('asyncGenerateNewRoom');

  const handleOpenNewRoom = async () => {
    try {
      setLoading(true);
      const roomGenerationResult = await asyncGenerateNewRoom();
      console.log(roomGenerationResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!profile.currentRoomId) {
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{
          height: '100%',
        }}
      >
        <Col>
          <Button type="primary" block onClick={handleOpenNewRoom}>
            Open a Room
          </Button>
        </Col>
      </Row>
    );
  }

  return <Room roomId={profile.currentRoomId} />;
};

export default HostRoomPage;
