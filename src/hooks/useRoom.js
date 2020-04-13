import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { isLoaded, isEmpty, useFirestoreConnect } from 'react-redux-firebase';

const useRoom = () => {
  const history = useHistory();
  const roomId = useSelector((state) => state.room.id);
  const roomReference = `rooms.${roomId}`;
  const roomDataQuery = {
    collection: 'rooms',
    doc: roomId,
    storeAs: roomReference,
  };
  useFirestoreConnect([roomDataQuery]);
  const [room, setRoom] = useState({
    id: '',
    hostUid: '',
    hostDisplayName: '',
    guestUids: [],
    guestDisplayNames: [],
    currentlyPlaying: '',
  });
  const roomSelector = useSelector(
    (state) => state.firestore.ordered[roomReference],
  );
  const roomData =
    isLoaded(roomSelector) && !isEmpty(roomSelector) && roomSelector[0]
      ? roomSelector[0]
      : null;

  useEffect(() => {
    if (isLoaded(roomSelector)) {
      if (isEmpty(roomSelector)) {
        history.replace('/');
      } else if (roomData) {
        setRoom({
          id: roomId,
          ...roomData,
        });
      }
    }
  }, [history, roomSelector, roomId, roomData]);
  return room;
};

export default useRoom;
