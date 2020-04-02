import React, { useState } from 'react';

import { useFirestore } from 'react-redux-firebase';

import { useSelector } from 'react-redux';

import { Empty, Button, List, Typography } from 'antd';

import { Trash, ChevronUp } from 'react-feather';

import { Flipper, Flipped } from 'react-flip-toolkit';

import QueueItem from '../QueueItem';

const ComingUpItem = props => {
  const { request, index, roomId, ...rest } = props;

  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const uid = auth.uid;

  const firestore = useFirestore();

  const arrayUnion = firestore.FieldValue.arrayUnion;
  const arrayRemove = firestore.FieldValue.arrayRemove;
  const increment = firestore.FieldValue.increment;

  const upvotes = request.upvotes ? request.upvotes : [];
  const upvotesCount = request.upvotesCount ? request.upvotesCount : 0;
  const upvoted = upvotes.includes(uid);

  const buttonClass = upvoted ? 'upvote-button-upvoted' : 'upvote-button';

  const requestReference = firestore
    .collection(`rooms/${roomId}/requests`)
    .doc(request.id);

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

  const handleDeleteRequest = async () => {
    try {
      await requestReference.delete();
    } catch (error) {
      console.error(error);
    }
  };

  const actions = [
    <Typography.Text
      key="upvotesCount"
      style={{
        fontWeight: '600',
        color: 'white',
      }}
    >
      {upvotesCount}
    </Typography.Text>,
    <ChevronUp
      size={30}
      className={buttonClass}
      key="list-loadmore-edit"
      onClick={toggleUpvoted}
    />,
  ];

  if (
    uid === request.uid ||
    (profile.currentRoomId && profile.currentRoomId === roomId)
  ) {
    actions.splice(
      0,
      0,
      <Trash
        key="deleteRequest"
        onClick={handleDeleteRequest}
        style={{
          fontSize: '1.5em',
          color: 'white',
        }}
      />,
    );
  }

  return (
    <Flipped key={request.id} flipId={request.id}>
      <div>
        <QueueItem request={request} actions={actions} {...rest} />
      </div>
    </Flipped>
  );
};

const ComingUp = props => {
  const { requests, ...rest } = props;

  const [limit, setLimit] = useState(5);

  const cleanedRequests = requests.filter(
    request =>
      request.creationTimestamp && !request.fulfilled && !request.queued,
  );

  const comingUpRequests = cleanedRequests.sort((a, b) => {
    const upvotesDifference = b.upvotesCount - a.upvotesCount;
    if (upvotesDifference) return upvotesDifference;
    return a.creationTimestamp.seconds - b.creationTimestamp.seconds;
  });

  if (!comingUpRequests.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="" />; // TODO: Make more attractive, center
  }

  const limitedComingUpRequests = comingUpRequests.slice(0, limit);
  const flipKey = limitedComingUpRequests.map(result => result.id).join('');

  const onLoadMore = () => {
    setLimit(limit + 5);
  };

  const loadMore =
    comingUpRequests.length > limit ? (
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
    <Flipper flipKey={flipKey}>
      <List size="small" loadMore={loadMore}>
        {limitedComingUpRequests.map((request, index) => (
          <ComingUpItem
            key={`${index}_${request.id}`}
            request={request}
            index={index}
            {...rest}
          />
        ))}
      </List>
    </Flipper>
  );
};

export default ComingUp;
