import { SET_PLAYBACK, UPDATE_PLAYBACK } from '../actions';

const initialState = {
  device: {
    id: '',
    is_active: false,
    is_private_session: false,
    is_restricted: false,
    name: '',
    type: '',
    volume_percent: 0,
  },
  shuffle_state: false,
  repeat_state: '',
  timestamp: 0,
  context: null,
  progress_ms: 0,
  item: {},
  currently_playing_type: '',
  is_playing: false,
};

const playbackReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYBACK: {
      const playback = action.payload;
      return playback;
    }
    case UPDATE_PLAYBACK: {
      const playbackUpdate = action.payload;
      const newPlaybackObject = {};
      Object.assign(newPlaybackObject, state);
      Object.assign(newPlaybackObject, playbackUpdate);
      return newPlaybackObject;
    }
    default:
      return state;
  }
};

export default playbackReducer;
