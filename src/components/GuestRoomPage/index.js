import React from 'react';

import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import LoadingPage from '../LoadingPage';

import Room from '../Room';

const GuestRoomPage = props => {
  let { roomId } = useParams();

  roomId = roomId.toUpperCase();

  const auth = useSelector(state => state.firebase.auth);

  const guestProvidersReference = 'guestProviders';

  const firestoreGuestProvidersQuery = {
    collection: `providers`,
    storeAs: guestProvidersReference,
  };

  const guestDisplayNameReference = 'guestDisplayNames';

  const firestoreGuestNameQuery = {
    collection: `guests`,
    doc: auth.uid,
    storeAs: guestDisplayNameReference,
  };

  useFirestoreConnect([firestoreGuestProvidersQuery, firestoreGuestNameQuery]);

  const guestProviders = useSelector(
    state => state.firestore.ordered[guestProvidersReference],
  );

  if (!isLoaded(guestProviders)) {
    return <LoadingPage />;
  }

  if (isEmpty(guestProviders)) {
    // this means there is no collection? not realistic
  }

  return <Room roomId={roomId} guestProviders={guestProviders} {...props} />;
};

export default GuestRoomPage;
