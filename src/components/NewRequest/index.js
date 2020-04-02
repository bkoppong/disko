import React, { useCallback } from 'react';
import { useFirestore, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import SearchBar from '../SearchBar';

import { GUEST_DISPLAY_NAME_REFERENCE } from '../../constants';

const NewRequest = props => {
  const { room } = props;
  const roomId = room.id;
  const firestore = useFirestore();

  const auth = useSelector(state => state.firebase.auth);
  const guestDisplayNameSelector = useSelector(
    state => state.firestore.ordered[GUEST_DISPLAY_NAME_REFERENCE],
  );
  let disabled = true;
  let displayName = auth.displayName;

  if (
    !isEmpty(auth) &&
    isLoaded(guestDisplayNameSelector) &&
    !isEmpty(guestDisplayNameSelector)
  ) {
    displayName = guestDisplayNameSelector[0].displayName;
  }

  if (displayName) {
    disabled = false;
  }

  const handleAddRequest = useCallback(
    async trackData => {
      try {
        if (!trackData) {
          throw new Error('No valid track selected.');
        }
        if (!displayName) {
          return;
        }
        const uid = auth.uid;
        const isAnonymous = auth.isAnonymous;
        const arrayUnion = firestore.FieldValue.arrayUnion;
        const increment = firestore.FieldValue.increment;
        const requestReference = firestore
          .collection(`rooms/${roomId}/requests`)
          .doc(trackData.uri);
        // IF THE REQUEST ALREADY EXISTS IN THE ROOM, TREAT AS UPVOTE
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
    },
    [firestore, auth, roomId, displayName],
  );

  return (
    <SearchBar
      onSelectResult={handleAddRequest}
      disabled={disabled}
      {...props}
    />
  );
};

export default NewRequest;
