import { useEffect, useState } from 'react';

import { useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import useSpotify from './useSpotify';
import useCurrentPlaybackMonitor from './useCurrentPlaybackMonitor';
import useRequests from './useRequests';

const useSpotifyQueue = () => {
  const currentPlaybackState = useCurrentPlaybackMonitor();
  const { notPlayed } = useRequests();
  const firestore = useFirestore();
  const spotify = useSpotify();
  const roomId = useSelector((state) => state.room.id);

  // const currentPlaybackUri =
  //   currentPlaybackState && currentPlaybackState.item && currentPlaybackState.item.uri
  //     ? currentPlaybackState.item.uri
  //     : null;

  const [lessThanTenSeconds, setLessThanTenSeconds] = useState(false);
  const [queued, setQueued] = useState(false);

  useEffect(() => {
    const timeRemaining =
      currentPlaybackState &&
      currentPlaybackState.item &&
      currentPlaybackState.item.duration_ms &&
      currentPlaybackState.progress_ms
        ? currentPlaybackState.item.duration_ms -
          currentPlaybackState.progress_ms
        : false;
    if (timeRemaining && timeRemaining <= 10000) {
      setLessThanTenSeconds(true);
    } else {
      setLessThanTenSeconds(false);
      setQueued(false);
    }
  }, [currentPlaybackState]);

  useEffect(() => {
    if (lessThanTenSeconds && !queued && notPlayed) {
      const trackToQueue = notPlayed.find((request) => true);
      if (trackToQueue && !trackToQueue.queued) {
        const trackUriToQueue = trackToQueue.id;
        setQueued(true);
        firestore
          .collection('rooms')
          .doc(roomId)
          .collection('requests')
          .doc(trackUriToQueue)
          .update({
            queued: true,
            queueTimestamp: firestore.FieldValue.serverTimestamp(),
          });
        spotify.addTrackToMyQueue(trackUriToQueue);
      }
    }
  }, [firestore, lessThanTenSeconds, queued, notPlayed, roomId, spotify]);
};

export default useSpotifyQueue;
