import React, { useState } from 'react';

import { useFirestore } from 'react-redux-firebase';

import { useSelector } from 'react-redux';

import { Button, List, Typography, Row } from 'antd';

import { Trash, ChevronUp, Inbox } from 'react-feather';

import { Flipper, Flipped } from 'react-flip-toolkit';

import QueueItem from '../QueueItem';

import { useRequests } from '../../hooks';

const ComingUpItem = ({ request, index, pageIsVisible, ...rest }) => {
  const roomId = useSelector((state) => state.room.id);

  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);

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
        <QueueItem
          request={request}
          actions={actions}
          pageIsVisible={pageIsVisible}
          {...rest}
        />
      </div>
    </Flipped>
  );
};

const ComingUp = ({ pageIsVisible, ...rest }) => {
  const comingUpRequests = useRequests().notPlayed;

  const [limit, setLimit] = useState(5);

  if (!comingUpRequests.length) {
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{ flexGrow: '1' }}
      >
        <Inbox size={60} color="white" />
      </Row>
    );
  }

  const limitedComingUpRequests = comingUpRequests.slice(0, limit);
  const flipKey = limitedComingUpRequests.map((result) => result.id).join('');

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
            pageIsVisible={pageIsVisible}
            {...rest}
          />
        ))}
      </List>
    </Flipper>
  );
};

export default ComingUp;
