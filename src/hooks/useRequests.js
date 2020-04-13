import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { isLoaded, isEmpty, useFirestoreConnect } from 'react-redux-firebase';

const useRequests = () => {
  const roomId = useSelector((state) => state.room.id);
  const requestsReference = `rooms.${roomId}.requests`;
  const requestsQuery = {
    collection: `rooms/${roomId}/requests`,
    // orderBy: [
    //   ['upvotesCount', 'desc'],
    //   ['creationTimestamp', 'asc'],
    // ],
    // limit: limit,
    storeAs: requestsReference,
  };
  // Attach requests listener
  useFirestoreConnect(requestsQuery);
  // Get requests from redux state
  const requestsSelector = useSelector(
    (state) => state.firestore.ordered[requestsReference],
  );

  const [all, setAll] = useState();
  const [played, setPlayed] = useState([]);
  const [notPlayed, setNotPlayed] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded(requestsSelector)) {
      setLoaded(true);
      if (!isEmpty(requestsSelector)) {
        const playedRequests = requestsSelector
          .filter((request) => request.fulfilled && request.fulfillTimestamp)
          .sort((a, b) => {
            return a.fulfillTimestamp.seconds - b.fulfillTimestamp.seconds;
          });

        setPlayed(playedRequests);

        const notPlayedRequests = requestsSelector
          .filter((request) => request.creationTimestamp && !request.fulfilled)
          .sort((a, b) => {
            if (a.queued) return -1;
            if (b.queued) return 1;
            const upvotesDifference = b.upvotesCount - a.upvotesCount;
            if (upvotesDifference) return upvotesDifference;
            return a.creationTimestamp.seconds - b.creationTimestamp.seconds;
          });

        setNotPlayed(notPlayedRequests);

        const allRequests = playedRequests.concat(notPlayedRequests);
        setAll(allRequests);
      }
    }
  }, [requestsSelector]);

  return {
    all,
    played,
    notPlayed,
    loaded,
  };
};

export default useRequests;
