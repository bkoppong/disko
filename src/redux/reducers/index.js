import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import searchReducer from './search';
import roomReducer from './room';
import playbackReducer from './playback';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  search: searchReducer,
  room: roomReducer,
  playback: playbackReducer,
});

export default rootReducer;
