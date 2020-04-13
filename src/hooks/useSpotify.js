import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

import Spotify from 'spotify-web-api-js';

import useRoom from './useRoom';
import useHostProviderInfo from './useHostProviderInfo';
import useGuestProviderInfo from './useGuestProviderInfo';

const useSpotify = () => {
  const auth = useSelector((state) => state.firebase.auth);
  const { hostUid } = useRoom();
  const isHost = hostUid === auth.uid;

  const { accessToken: hostSpotifyAccessToken } = useHostProviderInfo();
  const { accessToken: guestSpotifyAccessToken } = useGuestProviderInfo();

  const [accessToken, setAccessToken] = useState('');

  const firebase = useFirebase();
  const asyncRefreshSpotifyToken = useCallback(
    firebase.functions().httpsCallable('asyncRefreshSpotifyToken'),
    [firebase],
  );
  const handleSpotifyError = useCallback(
    async (error) => {
      console.log(error);
      if (error.response) {
        const response = error.response;
        const responseObject = JSON.parse(response);
        const errorObject = responseObject.error;
        if (
          errorObject.status === 401 &&
          errorObject.message === 'The access token expired'
        ) {
          const newToken = await asyncRefreshSpotifyToken();

          console.log(newToken);
          console.log('Spotify error is due to expired access token.');
        } else if (errorObject.message === 'No token provided') {
          console.log('Spotify error is due to lack of an access token.');
          // TODO: Need to handle error when refresh token is expired
        }
      }
    },
    [asyncRefreshSpotifyToken],
  );

  const wrapObj = useCallback(
    function (thirdPartyLib) {
      function safeWrap(service, fn) {
        const ogFn = service[fn];
        service[fn] = function () {
          const ogResult = ogFn.apply(service, arguments);
          Promise.resolve(ogResult)
            .then((result) => {
              return result;
            })
            .catch(handleSpotifyError);
          return ogResult;
        };
      }

      for (const fn in thirdPartyLib) {
        const type = typeof thirdPartyLib[fn];
        if (type === 'function') {
          safeWrap(thirdPartyLib, fn);
        } else if (type === 'object') {
          wrapObj(thirdPartyLib[fn]);
        }
      }
    },
    [handleSpotifyError],
  );

  useEffect(() => {
    let newAccessToken;
    if (isHost && hostSpotifyAccessToken) {
      newAccessToken = hostSpotifyAccessToken;
    } else if (!isHost && guestSpotifyAccessToken) {
      newAccessToken = guestSpotifyAccessToken;
    }
    if (newAccessToken && newAccessToken !== accessToken) {
      setAccessToken(newAccessToken);
    }
  }, [hostSpotifyAccessToken, guestSpotifyAccessToken, accessToken, isHost]);

  const [spotify, setSpotify] = useState(new Spotify());

  useEffect(() => {
    if (accessToken) {
      const setupSpotify = async () => {
        const newSpotify = new Spotify();
        wrapObj(newSpotify);
        await newSpotify.setAccessToken(accessToken);
        await newSpotify.searchTracks('test');
        setSpotify(newSpotify);
      };
      setupSpotify();
    }
  }, [accessToken, wrapObj]);

  return spotify;
};

export default useSpotify;
