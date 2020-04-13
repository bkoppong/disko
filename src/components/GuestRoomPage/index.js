import React from 'react';

import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { useFirestoreConnect } from 'react-redux-firebase';

import { GUEST_DISPLAY_NAME_REFERENCE } from '../../constants';

import Room from '../Room';

const GuestRoomPage = (props) => {
  let { roomId } = useParams();

  roomId = roomId.toUpperCase();

  const auth = useSelector((state) => state.firebase.auth);

  const firestoreGuestNameQuery = {
    collection: `guests`,
    doc: auth.uid,
    storeAs: GUEST_DISPLAY_NAME_REFERENCE,
  };

  useFirestoreConnect([firestoreGuestNameQuery]);

  return <Room roomId={roomId} {...props} />;
};

export default GuestRoomPage;
