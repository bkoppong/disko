import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useFirestore } from 'react-redux-firebase';

import { Row, Col, Affix } from 'antd';

import fetch from 'isomorphic-unfetch';

import { Play, Pause, SkipForward, SkipBack } from 'react-feather';

import { withSpotify } from './spotify';

const SpotifyPlayer = ({
  spotify,
  handleSpotifyAction,
  handleSpotifyError,
  roomId,
  ...rest
}) => {
  const [currentPlaybackState, setCurrentPlaybackState] = useState(null);
  const [currentPlaybackUri, setCurrentPlaybackUri] = useState(null);
  const [lessThanTwentySeconds, setLessThanTwentySeconds] = useState(false);
  const firestore = useFirestore();

  // const requestsReference = `rooms/${roomId}/requests`; // use to avoid query

  const updateCurrentPlaybackState = useCallback(async () => {
    const fetchCurrentPlaybackState = async () => {
      try {
        const newPlaybackState = await handleSpotifyAction(
          'getMyCurrentPlaybackState',
        );

        if (newPlaybackState instanceof Error) {
          throw newPlaybackState;
        }

        return newPlaybackState;
      } catch (error) {
        console.error(error);
      }
    };

    const playbackState = await fetchCurrentPlaybackState();
    const playbackUri =
      playbackState && playbackState.item && playbackState.item.uri
        ? playbackState.item.uri
        : null;
    const timeRemaining =
      playbackState &&
      playbackState.item &&
      playbackState.item.duration_ms &&
      playbackState.progress_ms
        ? playbackState.item.duration_ms - playbackState.progress_ms
        : false;
    const lessThanTwentySeconds = timeRemaining && timeRemaining <= 20000;
    await setCurrentPlaybackState(playbackState);
    await setCurrentPlaybackUri(playbackUri);
    await setLessThanTwentySeconds(lessThanTwentySeconds);
  }, [handleSpotifyAction]);

  const handleSkipToPrevious = async () => {
    await handleSpotifyAction('skipToPrevious');
  };
  const handleSkipToNext = async () => {
    await addTopRequestToQueue();
    await handleSpotifyAction('skipToNext');
  };
  const handlePause = async () => {
    await handleSpotifyAction('pause');
  };
  const handlePlay = async () => {
    await handleSpotifyAction('play');
  };
  const addTrackToEndOfQueue = useCallback(
    async trackUri => {
      try {
        const accessToken = await handleSpotifyAction('getAccessToken');

        if (accessToken instanceof Error) {
          throw accessToken;
        }

        const response = await fetch(
          `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    [handleSpotifyAction],
  );

  // const requestsReference = `rooms.${roomId}.requests`;
  // const requests = useSelector(
  //   state => state.firestore.ordered[requestsReference],
  // );

  const requestCollectionRef = useMemo(() => {
    // shouldn't I use useFirestoreConnect?
    return firestore
      .collection('rooms')
      .doc(roomId)
      .collection('requests');
  }, [firestore, roomId]);
  const firestoreServerTimestamp = useMemo(
    () => firestore.FieldValue.serverTimestamp,
    [firestore],
  );

  const addTopRequestToQueue = useCallback(async () => {
    // use firestore compound queries to get top 1? or render as child of room
    const requestCollectionSnapList = await requestCollectionRef.get();
    if (!requestCollectionSnapList.empty) {
      const requestsList = [];
      requestCollectionSnapList.forEach(requestDocSnap => {
        const requestDocRef = requestDocSnap.ref;
        let requestDocData = requestDocSnap.data();
        requestDocData = {
          ref: requestDocRef,
          ...requestDocData,
        };
        requestsList.push(requestDocData);
      });
      // this is trash
      // if something is already queued but not played, don't queue another
      // TODO: This causes an issue because sometimes it doesn't update the request as fulfilled
      if (
        requestsList.find(
          request =>
            request.creationTimestamp && request.queued && !request.fulfilled,
        )
      ) {
        return;
      }
      const cleanedRequests = requestsList
        .filter(
          request =>
            request.creationTimestamp && !request.fulfilled && !request.queued,
        )
        .sort((a, b) => {
          const upvotesDifference = b.upvotesCount - a.upvotesCount;
          if (upvotesDifference) return upvotesDifference;
          return a.creationTimestamp.seconds - b.creationTimestamp.seconds;
        });
      const topRequest = cleanedRequests[0];
      if (topRequest) {
        const addToQueueTask = addTrackToEndOfQueue(topRequest.trackData.uri);
        const updateRequestTask = topRequest.ref.update({
          queued: true,
          queueTimestamp: firestoreServerTimestamp(),
        }); // probably want to actually remove it from the collection and put in 'history' collection
        // upNextUri for string field in doc?
        await Promise.all([addToQueueTask, updateRequestTask]);
        // console.log('song queued');
      }
    }
  }, [requestCollectionRef, addTrackToEndOfQueue, firestoreServerTimestamp]); // may need firestoreServerTimestamp

  useEffect(() => {
    const playbackStateListener = setInterval(() => {
      updateCurrentPlaybackState();
    }, 3000);
    return () => {
      clearInterval(playbackStateListener);
    };
  }, [updateCurrentPlaybackState]);

  // const currentPlaybackUri = (currentPlaybackState &&
  //   currentPlaybackState.item) ? currentPlaybackState.item : null;
  // console.log(currentPlaybackUri);

  // console.log(lessThanTwentySeconds);

  useEffect(() => {
    // console.log(`Listener ran: ${lessThanTwentySeconds}`);
    if (lessThanTwentySeconds) {
      // console.log('less than 15 seconds left');
      // Add top song on request list to user queue
      // if (isLoaded(requests) && !isEmpty(requests)) {
      addTopRequestToQueue();
    }
    return () => {};
  }, [lessThanTwentySeconds, addTopRequestToQueue]);

  // Listen for if song queue item has been fulfilled
  useEffect(() => {
    const updateFulfilledRequests = async () => {
      if (currentPlaybackUri) {
        const requestCollectionSnapList = await requestCollectionRef.get();
        const requestDocList = [];
        if (!requestCollectionSnapList.empty) {
          requestCollectionSnapList.forEach(requestDocSnap => {
            let requestDocData = requestDocSnap.data();
            requestDocData = {
              ref: requestDocSnap.ref,
              ...requestDocData,
            };
            requestDocList.push(requestDocData);
          });
        }
        const queuedRequests = requestDocList.filter(
          requestDoc => requestDoc.queued,
        );
        const currentlyPlayingQueuedSong = queuedRequests.find(
          queuedRequest => queuedRequest.trackData.uri === currentPlaybackUri,
        );
        if (currentlyPlayingQueuedSong) {
          currentlyPlayingQueuedSong.ref.update({
            fulfilled: true,
            fulfillTimestamp: firestoreServerTimestamp(),
          });
        }
      }
    };
    updateFulfilledRequests();
  }, [currentPlaybackUri, requestCollectionRef, firestoreServerTimestamp]);

  const getPauseOrPlayButton = () => {
    if (currentPlaybackState && currentPlaybackState.is_playing) {
      // if paused
      return <Pause onClick={handlePause} />;
    } else {
      return <Play onClick={handlePlay} />;
    }
  };

  return (
    <Affix
      offsetBottom={0}
      style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
      }}
    >
      <Row
        type="flex"
        align="middle"
        justify="space-between"
        className="disko-player"
      >
        <Col align="middle" span={8}>
          <Row type="flex" align="middle" justify="center">
            <SkipBack onClick={handleSkipToPrevious} />
          </Row>
        </Col>
        <Col align="middle" span={8}>
          <Row type="flex" align="middle" justify="center">
            {getPauseOrPlayButton()}
          </Row>
        </Col>
        <Col align="middle" span={8}>
          <Row type="flex" align="middle" justify="center">
            <SkipForward onClick={handleSkipToNext} />
          </Row>
        </Col>
      </Row>
    </Affix>
  );
};

export default withSpotify(SpotifyPlayer);

// useEffect(() => {
//   const script = document.createElement('script');
//
//   script.src = "https://sdk.scdn.co/spotify-player.js";
//   // script.async = true; // remove?
//
//   document.body.appendChild(script);
//
//   return () => {
//     document.body.removeChild(script);
//   }
// }, []);

// useEffect(() => {
//
//   const spotifyInit = document.createElement('script');
//
//   window.onSpotifyWebPlaybackSDKReady = () => {
//     let checkForProfileInterval = setInterval(() => {
//       console.log('checking for profile');
//       if (profile && profile.accessToken) {
//         clearInterval(checkForProfileInterval);
//
//         const token = profile.accessToken;
//         console.log('found token: ' + token);
//
//         spotifyInit.type = 'text/javascript';
//         // spotifyInit.async = true;
//         spotifyInit.innerHTML = `
//           const player = new Spotify.Player({
//             name: 'Queueify Player',
//             getOAuthToken: cb => { cb('${token}'); }
//           });
//           console.log('token: ${token}');
//
//           player.addListener('initialization_error', ({ message }) => { console.error(message); });
//           player.addListener('authentication_error', ({ message }) => { console.error(message); });
//           player.addListener('account_error', ({ message }) => { console.error(message); });
//           player.addListener('playback_error', ({ message }) => { console.error(message); });
//
//           // Playback status updates
//           player.addListener('player_state_changed', state => { console.log(state); });
//
//           // Ready
//           player.addListener('ready', ({ device_id }) => {
//             console.log('Ready with Device ID', device_id);
//           });
//
//           // Not Ready
//           player.addListener('not_ready', ({ device_id }) => {
//             console.log('Device ID has gone offline', device_id);
//           });
//
//           // Connect to the player!
//           player.connect();
//           console.log('player connected');
//         `;
//
//         document.body.appendChild(spotifyInit);
//       }
//     }, 300);
//   };
//
//   return () => {
//     document.body.removeChild(spotifyInit);
//   }
// }, []);
