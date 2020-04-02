import React from 'react';

import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import {
  GUEST_PROVIDERS_REFERENCE,
  GUEST_DISPLAY_NAME_REFERENCE,
} from '../../constants';

import Room from '../Room';

const GuestRoomPage = props => {
  let { roomId } = useParams();

  roomId = roomId.toUpperCase();

  const auth = useSelector(state => state.firebase.auth);

  const firestoreGuestProvidersQuery = {
    collection: `providers`,
    storeAs: GUEST_PROVIDERS_REFERENCE,
  };

  const firestoreGuestNameQuery = {
    collection: `guests`,
    doc: auth.uid,
    storeAs: GUEST_DISPLAY_NAME_REFERENCE,
  };

  useFirestoreConnect([firestoreGuestProvidersQuery, firestoreGuestNameQuery]);

  // const guestProviders = useSelector(
  //   state => state.firestore.ordered[GUEST_PROVIDERS_REFERENCE],
  // );

  // if (!isLoaded(guestProviders)) {
  //   return <LoadingPage />;
  // }
  //
  // if (isEmpty(guestProviders)) {
  //   // this means there is no collection? not realistic
  // }

  return <Room roomId={roomId} {...props} />;
};

export default GuestRoomPage;
