import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useFirestore } from 'react-redux-firebase'
import './Todo.css'

import {
  List,
  Button,
  Typography,
} from 'antd';

function TodoItem(props) {
  const auth = useSelector(state => state.firebase.auth);

  const firestore = useFirestore();

  let requestReference = firestore.collection('requests').doc(props.id);

  const arrayUnion = firestore.FieldValue.arrayUnion;
  const arrayRemove = firestore.FieldValue.arrayRemove;
  const increment = firestore.FieldValue.increment;

  const uid = auth.uid;

  const upvotes = props.upvotes ? props.upvotes : [];
  const upvotesCount = props.upvotesCount ? props.upvotesCount : 0;
  const upvoted = upvotes.includes(uid);

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

  // function deleteTodo() {
  //   return firestore.delete(`requests/${id}`)
  // }

  const buttonType = upvoted ? "primary" : "default";

  return (
    <List.Item
      actions={[
        <Typography.Text>
          {upvotesCount}
        </Typography.Text>,
        <Button
          key="list-loadmore-edit"
          icon="up"
          onClick={toggleUpvoted}
          type={buttonType}
        />
      ]}
    >
      <Typography.Text>{props.songName}</Typography.Text>
    </List.Item>
  )
}

// TodoItem.propTypes = {
//   id: PropTypes.string.isRequired
// };

export default TodoItem
