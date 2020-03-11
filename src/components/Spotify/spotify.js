import React, {
  useEffect,
  useCallback,
} from 'react';

import {
  useSelector,
} from 'react-redux';

import {
  // isLoaded,
  useFirebase,
} from 'react-redux-firebase';

import Spotify from 'spotify-web-api-js';

const spotify = new Spotify();

const withSpotify = (WrappedComponent) => {

  return (props) => {

    const spotifyAccessToken = useSelector(state => state.spotify.accessToken);
    const firebase = useFirebase();

    const handleSpotifyError = useCallback(async (error) => {

      // console.log(error);

      const asyncRefreshSpotifyAccessToken = firebase.functions().httpsCallable('asyncRefreshSpotifyAccessToken');
      const asyncGetSpotifyAccessToken = firebase.functions().httpsCallable('asyncGetSpotifyAccessToken');

      if (error.response) {
        const response = error.response;
        const responseObject = JSON.parse(response);
        const errorObject = responseObject.error;
        if (errorObject.status === 401 &&
          errorObject.message === 'The access token expired') {

          // console.log('Spotify error is due to expired access token.');
          asyncRefreshSpotifyAccessToken();
        } else if (errorObject.message === 'No token provided') {

          // console.log('Spotify error is due to lack of an access token.');
          asyncGetSpotifyAccessToken();
        }
      }
    }, [firebase]);

    const handleSpotifyAction = useCallback(async (spotifyFunctionName, spotifyFunctionArguments) => {
      try {
        const result = await spotify[spotifyFunctionName](spotifyFunctionArguments);
        return result;
      } catch (error) {
        handleSpotifyError(error);
        return new Error(error.message);
      }
    }, [handleSpotifyError]);

    useEffect(() => {
      if (!spotifyAccessToken) {
        handleSpotifyAction('getMyCurrentPlaybackState');
      } else {
        const testSpotifyAccessToken = async () => {
          await handleSpotifyAction('setAccessToken', spotifyAccessToken);
          await handleSpotifyAction('getMyCurrentPlaybackState');
        };
        testSpotifyAccessToken();
      }
      return () => {

      };
    }, [handleSpotifyAction, spotifyAccessToken]);

    return <WrappedComponent
      spotify={spotify}
      handleSpotifyAction={handleSpotifyAction}
      handleSpotifyError={handleSpotifyError}
      {...props}
      />;

  };

};

export {
  withSpotify,
};
