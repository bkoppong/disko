import { TOGGLE_UPVOTE } from '../actions';

const initialState = [];
const requestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_UPVOTE: {
      const { id } = action.payload;

      if (state.includes(id)) {
        return state.filter((listItem) => listItem !== id);
      }

      state.push(id);

      return state;
    }
    default:
      return state;
  }
};

export default requestsReducer;
