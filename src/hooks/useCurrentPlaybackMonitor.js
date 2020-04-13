import { useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useFirestore } from 'react-redux-firebase';

import useRoom from './useRoom';
import useSpotify from './useSpotify';

import { setPlayback } from '../redux/actions';

const useCurrentPlaybackMonitor = () => {
  const spotify = useSpotify();
  const dispatch = useDispatch();

  const setCurrentPlaybackState = useCallback(
    (playbackState) => {
      dispatch(setPlayback(playbackState));
    },
    [dispatch],
  );
  const refreshCurrentPlaybackState = useCallback(async () => {
    if (spotify.getAccessToken()) {
      const playbackState = await spotify.getMyCurrentPlaybackState();
      await setCurrentPlaybackState(playbackState);
    }
  }, [spotify, setCurrentPlaybackState]);

  useEffect(() => {
    // if (isBrowser) { // browser or not?
    const playbackStateListener = setInterval(() => {
      refreshCurrentPlaybackState();
    }, 1500);
    return () => {
      clearInterval(playbackStateListener);
    };
    // }
  }, [refreshCurrentPlaybackState]);

  const firestore = useFirestore();
  const currentPlaybackState = useSelector((state) => state.playback);
  const { currentlyPlaying: currentPlaybackUri, id: roomId } = useRoom();

  useEffect(() => {
    const playbackUri =
      currentPlaybackState &&
      currentPlaybackState.item &&
      currentPlaybackState.item.uri
        ? currentPlaybackState.item.uri
        : null;
    if (roomId && playbackUri && playbackUri !== currentPlaybackUri) {
      const roomRef = firestore.collection('rooms').doc(roomId);

      const requestRef = roomRef.collection('requests').doc(playbackUri);

      requestRef.get().then((requestSnap) => {
        if (requestSnap.exists) {
          const requestData = requestSnap.data();
          if (!requestData.fulfilled) {
            requestRef.update({
              fulfilled: true,
              fulfillTimestamp: firestore.FieldValue.serverTimestamp(),
            });
          }
        }
      });

      firestore.collection('rooms').doc(roomId).update({
        currentlyPlaying: playbackUri,
      });
    }
  }, [currentPlaybackState, currentPlaybackUri, firestore, roomId]);

  return currentPlaybackState;
};

export default useCurrentPlaybackMonitor;
