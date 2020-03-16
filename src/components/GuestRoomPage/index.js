import React, { useEffect } from 'react';

import {
  connect,
  useSelector,
} from 'react-redux';

import {
  useFirebase,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase';

import {
  useParams,
} from 'react-router-dom';

import {
  setAccessToken,
} from '../../redux/actions';

import Room from '../Room';
import LoadingPage from '../LoadingPage';

const GuestRoomPage = props => {

  let {
    roomId,
  } = useParams();

  roomId = roomId.toUpperCase();

  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);

  const {
    dispatch,
  } = props;

  useEffect(() => {
    try {


      const asyncGetSpotifyAccessToken = firebase.functions().httpsCallable('asyncGetSpotifyAccessToken');

      const signInAndGetAccessToken = async () => {

        if (isLoaded(auth) && isEmpty(auth)) {
          await firebase.auth().signInAnonymously();
        }

        asyncGetSpotifyAccessToken().then(({
          data
        }) => {
          dispatch(
            setAccessToken(data)
          );
        });

      };

      signInAndGetAccessToken();

    } catch (error) {
      console.error(error);
    }

    return () => {

    };

  }, [firebase, auth, dispatch]);

  if (!isLoaded(auth) || isEmpty(auth)) {
    return <LoadingPage />;
  }

  return (
    <Room
      roomId={roomId}
      auth={auth}
    />
  );

};

export default connect()(GuestRoomPage);
