import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useFirestore, isLoaded, isEmpty } from 'react-redux-firebase';
import { Row, List } from 'antd';

import { Search as SearchIcon } from 'react-feather';

import LoadingPage from '../LoadingPage';

import SearchItem from '../SearchItem';

import { GUEST_DISPLAY_NAME_REFERENCE } from '../../constants';

import { endSearch } from '../../redux/actions';

const SearchResults = (props) => {
  const roomId = useSelector((state) => state.room.id);

  const searchData = useSelector((state) => state.search);
  const { searchResults, searchLoading } = searchData;

  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  const guestDisplayNameSelector = useSelector(
    (state) => state.firestore.ordered[GUEST_DISPLAY_NAME_REFERENCE],
  );
  const dispatch = useDispatch();
  const end = () => {
    dispatch(endSearch());
  };

  if (searchLoading) {
    return <LoadingPage />;
  }

  if (!searchResults || !searchResults.length) {
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{
          flexGrow: '1',
          paddingBottom: '80px',
        }}
      >
        <SearchIcon size={60} color="white" />
      </Row>
    );
  }

  if (!isLoaded(auth) || isEmpty(auth)) {
    return <LoadingPage />;
  }

  let displayName;

  if (auth.isAnonymous) {
    if (
      !isLoaded(guestDisplayNameSelector) ||
      isEmpty(guestDisplayNameSelector)
    ) {
      return <LoadingPage />;
    }
    displayName = guestDisplayNameSelector[0].displayName;
  } else {
    displayName = auth.displayName || 'anonymous';
  }

  const handleAddRequest = async (trackData) => {
    try {
      if (!trackData) {
        throw new Error('No valid track selected.');
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
  };

  return (
    <List size="small">
      {searchResults.map((track) => {
        const handleSelectResult = () => {
          end();
          handleAddRequest(track);
        };

        return (
          <SearchItem
            key={track.uri}
            handleSelectResult={handleSelectResult}
            track={track}
          />
        );
      })}
    </List>
  );
};

export default SearchResults;
