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

const GuestRoomPage = props => {

  const {
    roomId,
  } = useParams();

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
          console.log('guest room')
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

  return (
    <Room roomId={roomId} />
  );

};

export default connect()(GuestRoomPage);
