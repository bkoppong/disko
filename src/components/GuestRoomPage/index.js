import React, { useEffect } from 'react';

import { connect, useSelector } from 'react-redux';

import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';

import { useParams } from 'react-router-dom';

import Room from '../Room';

const GuestRoomPage = props => {
  let { roomId } = useParams();

  roomId = roomId.toUpperCase();

  // useEffect(() => {
  //   try {
  //     const asyncGetSpotifyAccessToken = firebase
  //       .functions()
  //       .httpsCallable('asyncGetSpotifyAccessToken');
  //
  //     const signInAndGetAccessToken = async () => {
  //       if (isLoaded(auth) && isEmpty(auth)) {
  //         await firebase.auth().signInAnonymously();
  //       }
  //
  //       asyncGetSpotifyAccessToken().then(({ data }) => {
  //         dispatch(setAccessToken(data));
  //       });
  //     };
  //
  //     signInAndGetAccessToken();
  //   } catch (error) {
  //     console.error(error);
  //   }
  //
  //   return () => {};
  // }, [firebase, auth, dispatch]);

  return <Room
    roomId={roomId}
    {...props}
  />;
};

export default GuestRoomPage;
