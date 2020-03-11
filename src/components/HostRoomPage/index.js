import React, { useEffect } from 'react';

import {
  Redirect,
} from 'react-router-dom';

import {
  useSelector,
  connect,
} from 'react-redux';

import {
  useFirebase,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase';

import {
  Row,
  Col,
  Button,
} from 'antd';

import {
  setAccessToken,
} from '../../redux/actions';

import Room from '../Room';
import {
  SpotifyPlayer,
} from '../Spotify';
import LoadingPage from '../LoadingPage';

const HostRoomPage = props => {

  const { dispatch } = props;

  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  // const stateAccessToken = useSelector(state => state.spotify.accessToken);

  useEffect(() => {

    const data = {
      accessToken: profile.accessToken,
      expiresIn: 3600,
    };

    dispatch(
      setAccessToken(data)
    );
    console.log('dispatched');

    return () => {

    };

  }, [dispatch, profile.accessToken]);

  const asyncGenerateNewRoom = firebase.functions().httpsCallable('asyncGenerateNewRoom');

  if (!isLoaded(auth) || !isLoaded(profile)) {
    return <LoadingPage />;
  }

  if (isEmpty(profile) || !(auth.uid.startsWith('spotify:') || auth.uid.startsWith('applemusic:'))) {
    return <Redirect to="/authenticate" />;
  }

  const handleOpenNewRoom = async () => {
    try {
      const roomGenerationResult = await asyncGenerateNewRoom();
      console.log(roomGenerationResult);
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile.currentRoomId) {
    return (
      <Row
        align="middle"
        justify="center"
        style={{
          height: '100%',
        }}
      >
        <Col>
          <Button
            onClick={handleOpenNewRoom}
          >
            Open a Room
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Col span={24}>
      <Row
        type="flex"
        justify="center"
      >
        <Room roomId={profile.currentRoomId} />
      </Row>
      <Row
        type="flex"
        justify="center"
      >
        <SpotifyPlayer roomId={profile.currentRoomId} />
      </Row>
    </Col>
  );

};

export default connect()(HostRoomPage);
