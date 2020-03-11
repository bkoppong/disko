import {
  TOGGLE_UPVOTE,
  SET_ACCESS_TOKEN,
} from './actionTypes';

const toggleUpvote = content => ({
  type: TOGGLE_UPVOTE,
  payload: {
    content,
  },
});

const setAccessToken = content => ({
  type: SET_ACCESS_TOKEN,
  payload: content,
});

export {
  TOGGLE_UPVOTE,
  toggleUpvote,
  SET_ACCESS_TOKEN,
  setAccessToken,
};
