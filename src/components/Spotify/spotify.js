import React, { useEffect, useCallback, useMemo } from 'react';

// import { useSelector } from 'react-redux';

import { useFirebase } from 'react-redux-firebase';

import Spotify from 'spotify-web-api-js';

const spotify = new Spotify();

const withSpotify = WrappedComponent => {
  return props => {
    const { hostProviderInfo, guestProviderInfo } = props;

    const isHostComponent = hostProviderInfo;

    const providerInfo = isHostComponent ? hostProviderInfo : guestProviderInfo;

    const spotifyAccessToken = providerInfo ? providerInfo.accessToken : null;

    const firebase = useFirebase();

    const asyncRefreshSpotifyGuestToken = useMemo(() => {
      return firebase
        .functions()
        .httpsCallable('asyncRefreshSpotifyGuestToken');
    }, [firebase]);

    const asyncRefreshSpotifyHostToken = useMemo(() => {
      return firebase.functions().httpsCallable('asyncRefreshSpotifyHostToken');
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
            const newToken = await asyncRefreshSpotifyHostToken();
            console.log(newToken);
            console.log('Spotify error is due to expired access token.');
          } else if (errorObject.message === 'No token provided') {
            console.log('Spotify error is due to lack of an access token.');
            // asyncGetSpotifyAccessToken();
            // TODO: Need to handle error when refresh token is expired
          }
        }
      },
      [asyncRefreshSpotifyHostToken, asyncRefreshSpotifyGuestToken],
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
          try {
            if (isHostComponent) {
              await asyncRefreshSpotifyHostToken();
              console.log('host token refreshed');
            } else {
              await asyncRefreshSpotifyGuestToken();
            }
          } catch (error) {
            console.error(error);
          }
        };
        if (!spotifyAccessToken) {
          console.log('no token');
          await renewSpotifyAccessToken();
        } else {
          await handleSpotifyAction('setAccessToken', spotifyAccessToken);
        }
      },
      [
        asyncRefreshSpotifyHostToken,
        asyncRefreshSpotifyGuestToken,
        handleSpotifyAction,
        isHostComponent,
      ],
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
