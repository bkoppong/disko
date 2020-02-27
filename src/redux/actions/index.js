import { TOGGLE_UPVOTE } from './actionTypes';

const toggleUpvote = content => ({
  type: TOGGLE_UPVOTE,
  payload: {
    content,
  },
});

export {
  TOGGLE_UPVOTE,
  toggleUpvote,
}
