import React, { useEffect, useCallback, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useFirebase } from 'react-redux-firebase';

import Spotify from 'spotify-web-api-js';

import { setAccessToken } from '../../redux/actions';

const spotify = new Spotify();

const withSpotify = WrappedComponent => {
  return props => {
    const dispatch = useDispatch();
    const firebase = useFirebase();
    const spotifyAccessToken = useSelector(state => state.spotify.accessToken);

    const dispatchAccessToken = useCallback(
      data => {
        dispatch(setAccessToken(data));
      },
      [dispatch],
    );

    const asyncGetSpotifyAccessToken = useMemo(() => {
      return firebase.functions().httpsCallable('asyncGetSpotifyAccessToken');
    }, [firebase]);

    const asyncRefreshSpotifyAccessToken = useMemo(() => {
      return firebase
        .functions()
        .httpsCallable('asyncRefreshSpotifyAccessToken');
    }, [firebase]);

    const handleSpotifyError = useCallback(
      async error => {
        if (error.response) {
          const response = error.response;
          const responseObject = JSON.parse(response);
          const errorObject = responseObject.error;
          if (
            errorObject.status === 401 &&
            errorObject.message === 'The access token expired'
          ) {
            // console.log('Spotify error is due to expired access token.');
            asyncRefreshSpotifyAccessToken();
          } else if (errorObject.message === 'No token provided') {
            // console.log('Spotify error is due to lack of an access token.');
            asyncGetSpotifyAccessToken();
            // TODO: Need to handle error when refresh token is expired
          }
        }
      },
      [asyncGetSpotifyAccessToken, asyncRefreshSpotifyAccessToken],
    );

    const handleSpotifyAction = useCallback(
      async (spotifyFunctionName, spotifyFunctionArguments) => {
        try {
          const result = await spotify[spotifyFunctionName](
            spotifyFunctionArguments,
          );
          return result;
        } catch (error) {
          handleSpotifyError(error);
          return new Error(error.message);
        }
      },
      [handleSpotifyError],
    );

    const asyncHandleSpotifyAccess = useCallback(
      async spotifyAccessToken => {
        const renewSpotifyAccessToken = async () => {
          const { data } = await asyncGetSpotifyAccessToken();
          await dispatchAccessToken(data);
        };
        // const testSpotifyAccessToken = async () => {
        //   await handleSpotifyAction('setAccessToken', spotifyAccessToken);
        //   await handleSpotifyAction('getMyCurrentPlaybackState');
        // };
        if (!spotifyAccessToken) {
          await renewSpotifyAccessToken();
        } else {
          // await testSpotifyAccessToken();
          await handleSpotifyAction('setAccessToken', spotifyAccessToken);
        }
      },
      [asyncGetSpotifyAccessToken, dispatchAccessToken, handleSpotifyAction],
    );

    useEffect(() => {
      asyncHandleSpotifyAccess(spotifyAccessToken);
      return () => {};
    }, [asyncHandleSpotifyAccess, spotifyAccessToken]);

    if (!spotifyAccessToken) {
      return null;
    }

    // console.log(spotify.getAccessToken());

    return (
      <WrappedComponent
        spotify={spotify}
        handleSpotifyAction={handleSpotifyAction}
        handleSpotifyError={handleSpotifyError}
        {...props}
      />
    );
  };
};

// withSpotify = connect()(withSpotify);

export { withSpotify };
