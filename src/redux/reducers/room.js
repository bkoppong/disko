import { SET_ROOM_ID } from '../actions';

const initialState = {
  id: '',
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM_ID: {
      const roomId = action.payload;
      const updatedState = {
        ...state,
      };
      updatedState.id = roomId;
      return updatedState;
    }
    default:
      return state;
  }
};

export default roomReducer;
