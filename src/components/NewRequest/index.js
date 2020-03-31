import React from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import SearchBar from '../SearchBar';

const NewRequest = props => {
  const { room } = props;

  const auth = useSelector(state => state.firebase.auth);

  const roomId = room.id;

  const firestore = useFirestore();

  // const searchDisabled = (!isLoaded(auth) || isEmpty(auth));

  const handleAddRequest = async trackData => {
    try {
      const arrayUnion = firestore.FieldValue.arrayUnion;
      const increment = firestore.FieldValue.increment;

      if (!trackData) {
        throw new Error('No valid track selected.');
      }

      const uid = auth.uid;
      const displayName = auth.displayName;
      const isAnonymous = auth.isAnonymous;

      // IF THE REQUEST ALREADY EXISTS IN THE ROOM, TREAT AS UPVOTE

      const requestReference = firestore
        .collection(`rooms/${roomId}/requests`)
        .doc(trackData.uri);

      const requestSnap = await requestReference.get();

      if (requestSnap.exists) {
        const requestData = requestSnap.data();
        if (!requestData.upvotes.includes(uid)) {
          requestReference.update({
            upvotes: arrayUnion(uid),
            upvotesCount: increment(1),
          });
        }
        return;
      }

      const requestCreationObject = {
        trackData: trackData,
        upvotes: [uid],
        upvotesCount: 1,
        creationTimestamp: firestore.FieldValue.serverTimestamp(),
        uid: uid,
        displayName: displayName,
        queued: false,
        queueTimestamp: false,
        fulfilled: false,
        fulfillTimestamp: false,
        isAnonymous: isAnonymous,
      };

      return await requestReference.set(requestCreationObject);
    } catch (error) {
      console.error(error);
    }
  };

  return <SearchBar onSelectResult={handleAddRequest} {...props} />;
};

export default NewRequest;
