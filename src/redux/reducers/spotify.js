import { SET_ACCESS_TOKEN } from '../actions';

const initialState = {};

const spotifyReducer = (state = initialState, action) => {
  // MAY WANT TO USE GETSTATE AND USE FIREBASE WITHIN REDUX
  switch (action.type) {
    case SET_ACCESS_TOKEN: {
      const { accessToken, expiresIn } = action.payload;

      state.accessToken = accessToken;
      state.expiresIn = expiresIn;

      return state;
    }
    default:
      return state;
  }
};

export default spotifyReducer;
