import React from 'react';

import { useLocation, useHistory } from 'react-router-dom';

import { useFirebase } from 'react-redux-firebase';

import fetch from 'isomorphic-unfetch';

import LoadingPage from '../LoadingPage';

const AuthenticateSpotify = props => {
  const location = useLocation();
  const history = useHistory();

  const firebase = useFirebase();

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  const query = useQuery();

  const code = query.get('code');
  const state = query.get('state');
  const error = query.get('error');

  const authenticateWithSpotify = async () => {
    const spotifyTokenResponseReceived = async response => {
      const jsonData = await response.json();
      if (jsonData.token) {
        console.log('JSON TOKEN');
        console.log(jsonData.token);
        await firebase.auth().signInWithCustomToken(jsonData.token);
        console.log('logged in with custom token');
        history.push('/host');
      } else {
        console.log('JSON ERROR');
        console.error(jsonData);
        return `Error in the token Function: ${jsonData.error}`;
      }
    };

    if (error) {
    } else if (!code) {
      // Start the auth flow.
      const spotifyRedirectFunctionURL =
        'https://us-central1-music-queue-dev.cloudfunctions.net/spotifyRedirect';
      window.location.href = spotifyRedirectFunctionURL;
    } else {
      // This is the URL to the HTTP triggered 'spotifyToken' Firebase Function.
      // See https://firebase.google.com/docs/functions.
      // const spotifyTokenFunctionURL = 'https://us-central1-' + getFirebaseProjectId() + '.cloudfunctions.net/token';
      const spotifyTokenFunctionURL = `https://us-central1-music-queue-dev.cloudfunctions.net/spotifyToken?code=${encodeURIComponent(
        code,
      )}&state=${encodeURIComponent(state)}`;

      fetch(spotifyTokenFunctionURL, {
        credentials: 'include',
      }).then(spotifyTokenResponseReceived);
    }
  };

  authenticateWithSpotify();

  if (error) {
    return (
      <div>{`Error back from the Spotify auth page: ${error.message}`}</div>
    );
  }

  return <LoadingPage />;
};

export default AuthenticateSpotify;
