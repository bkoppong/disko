import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useFirestoreConnect,
  useFirestore,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase'
import TodoItem from './TodoItem'

import {
  List,
  Button,
  Typography,
} from 'antd';


function Todos() {

  const auth = useSelector(state => state.firebase.auth);

  const firestore = useFirestore();

  const arrayUnion = firestore.FieldValue.arrayUnion;
  const arrayRemove = firestore.FieldValue.arrayRemove;
  const increment = firestore.FieldValue.increment;

  const uid = auth.uid;

  const [limit, setLimit] = useState(5);
  const requestsReference = `userRequests`;

  const requestsQuery = {
    collection: 'requests',
    // orderBy: [
    //   ['upvotesCount', 'desc'],
    //   ['creationTimestamp', 'asc'],
    // ],
    // limit: limit,
    storeAs: requestsReference,
  };
  // Attach todos listener
  useFirestoreConnect(requestsQuery)
  // firestore.setListener(requestsQuery);

  // Get todos from redux state
  let requests = useSelector(state => state.firestore.ordered[requestsReference]);

  const onLoadMore = () => {
    setLimit(
      limit + 5
    );
  };

  // map IDs from requests and check if present

  // Show a message while todos are loading
  if (!isLoaded(requests)) {
    return null
  }

  // Show a message if there are no todos
  if (isEmpty(requests)) {
    return 'There are currently no requests!'
  }

  let cleanedRequests = requests
    .filter(request => request.creationTimestamp)
    .sort((a, b) => {
      let upvotesDifference = b.upvotesCount - a.upvotesCount;
      if (upvotesDifference) return upvotesDifference;
      return a.creationTimestamp.seconds - b.creationTimestamp.seconds;
    }).slice(0, limit);

  const loadMore =
      isLoaded(requests) && !isEmpty(requests) && requests.length > limit ? (
        <div
          style={{
            textAlign: 'center',
            margin: 8,
            height: 50,
            lineHeight: '40px',
          }}
        >
          <Button
            type="ghost"
            onClick={onLoadMore}
            style={{
              border: 'none',
              fontWeight: '600',
              color: 'white',
            }}
          >
            Load More
          </Button>
        </div>
      ) : null;


  return (
    <List
      size="large"
      bordered
      dataSource={cleanedRequests}
      renderItem={({ ind, ...request }) => {

        const upvotes = request.upvotes ? request.upvotes : [];
        const upvotesCount = request.upvotesCount ? request.upvotesCount : 0;
        const upvoted = upvotes.includes(uid);

        let requestReference = firestore.collection('requests').doc(request.id);

        function toggleUpvoted() {

          if (upvoted) {
            requestReference.update({
              upvotes: arrayRemove(uid),
              upvotesCount: increment(-1),
            });
          } else {
            requestReference.update({
              upvotes: arrayUnion(uid),
              upvotesCount: increment(1),
            });
          }
        }

        const buttonType = upvoted ? "primary" : "default";
        const buttonClass = upvoted ? "upvote-button-upvoted" : "upvote-button";

        return (
          <List.Item
            actions={[
              <Typography.Text style={{
                  fontWeight: '600',
                  color: 'white',
                }}>
                {upvotesCount}
              </Typography.Text>,
              <Button
                className={buttonClass}
                key="list-loadmore-edit"
                icon="up"
                onClick={toggleUpvoted}
              />
            ]}
          >
            <Typography.Text style={{
                fontWeight: '600',
                color: 'white',
              }}>
              {request.songName}
            </Typography.Text>
          </List.Item>
        );

      }}
      loadMore={loadMore}
    />
  );
}

export default Todos
