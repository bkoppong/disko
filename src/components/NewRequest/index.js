import React from 'react';
import {
  useFirestore,
  isLoaded,
} from 'react-redux-firebase';

import {
  useSelector,
} from 'react-redux';

import {
  SpotifySearchBar,
} from '../Spotify';

import LoadingPage from '../LoadingPage';

const NewRequest = props => {

  const {
    roomId,
    ...rest
  } = props;

  const firestore = useFirestore();

  const uid = useSelector(state => state.firebase.auth.uid);

  const searchDisabled = !isLoaded(uid);

  const handleAddRequest = async (trackData) => {

    // IF THE REQUEST ALREADY EXISTS IN THE ROOM, TREAT AS UPVOTE
    console.log(trackData);
    console.log(uid);

    return await firestore
      .collection(`rooms/${roomId}/requests`)
      .doc(trackData.uri)
      .set({
        trackData: trackData,
        upvotes: [uid,],
        upvotesCount: 1,
        creationTimestamp: firestore.FieldValue.serverTimestamp(),
        uid: uid,
        queued: false,
        queueTimestamp: false,
        fulfilled: false,
        fulfillTimestamp: false,
      });
  }

  return (
        <SpotifySearchBar
          onSelectResult={handleAddRequest}
          disabled={searchDisabled}
          {...rest}
        />
  )
}

export default NewRequest;
