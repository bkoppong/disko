import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
  isEmpty,
  isLoaded,
} from 'react-redux-firebase';

import { Row, Col, Button } from 'antd';

import { Trash } from 'react-feather';

import Room from '../Room';
import Player from '../Player';
import LoadingPage from '../LoadingPage';

const HostRoomPage = props => {
  const { auth, profile } = props;

  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);

  const hostProvidersReference = 'hostProviders';

  const firestoreHostProvidersQuery = {
    collection: `hosts/${auth.uid}/providers`,
    storeAs: hostProvidersReference,
  };

  useFirestoreConnect([firestoreHostProvidersQuery]);

  const hostProviders = useSelector(
    state => state.firestore.ordered[hostProvidersReference],
  );

  if (!isLoaded(hostProviders)) {
    return <LoadingPage />;
  }

  if (isEmpty(hostProviders)) {
    // redirect to home
  }

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
          hostActionComponents={<HostActionComponents {...props} />}
          hostProviders={hostProviders}
        />
      </Row>
      <Row type="flex" justify="center">
        <Player roomId={profile.currentRoomId} hostProviders={hostProviders} />
      </Row>
    </Col>
  );
};

const HostActionComponents = props => {
  const { auth, profile } = props;

  const firestore = useFirestore();

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

export default HostRoomPage;
