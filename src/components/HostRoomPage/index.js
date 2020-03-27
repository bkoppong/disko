import React, { useEffect, useState } from 'react';

import { useSelector, connect } from 'react-redux';

import { useFirebase, useFirestore } from 'react-redux-firebase';

import { Row, Col, Button } from 'antd';

import { Trash } from 'react-feather';

import { setAccessToken } from '../../redux/actions';

import Room from '../Room';
import { SpotifyPlayer } from '../Spotify';
import LoadingPage from '../LoadingPage';

const HostRoomPage = props => {
  const { dispatch } = props;

  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const [loading, setLoading] = useState(false);
  // const stateAccessToken = useSelector(state => state.spotify.accessToken);

  useEffect(() => {
    const data = {
      accessToken: profile.accessToken,
      expiresIn: 3600,
    };

    dispatch(setAccessToken(data));
    console.log('dispatched');

    return () => {};
  }, [dispatch, profile.accessToken]);

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

  return (
    <Col span={24}>
      <Row type="flex" justify="center">
        <Room
          roomId={profile.currentRoomId}
          auth={auth}
          hostActionComponents={<HostActionComponents />}
        />
      </Row>
      <Row type="flex" justify="center">
        <SpotifyPlayer roomId={profile.currentRoomId} />
      </Row>
    </Col>
  );
};

const HostActionComponents = props => {
  const firestore = useFirestore();
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const handleCloseRoom = async () => {
    await firestore
      .collection('rooms')
      .doc(profile.currentRoomId)
      .delete();
    await firestore
      .collection('hosts')
      .doc(auth.uid)
      .update({
        currentRoomId: firestore.FieldValue.delete(),
      });
  };

  return (
    <Button type="link" onClick={handleCloseRoom}>
      <Trash />
    </Button>
  );
};

export default connect()(HostRoomPage);
