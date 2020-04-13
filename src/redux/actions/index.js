import {
  UPDATE_SEARCH_DATA,
  START_SEARCH,
  END_SEARCH,
  SET_ROOM_ID,
  SET_PLAYBACK,
  UPDATE_PLAYBACK,
} from './actionTypes';

const updateSearchData = (content) => ({
  type: UPDATE_SEARCH_DATA,
  payload: content,
});

const startSearch = () => ({
  type: START_SEARCH,
});

const endSearch = () => ({
  type: END_SEARCH,
});

const setRoomId = (roomId) => ({
  type: SET_ROOM_ID,
  payload: roomId,
});

const setPlayback = (playback) => ({
  type: SET_PLAYBACK,
  payload: playback,
});

const updatePlayback = (playback) => ({
  type: UPDATE_PLAYBACK,
  payload: playback,
});

export {
  UPDATE_SEARCH_DATA,
  updateSearchData,
  START_SEARCH,
  startSearch,
  END_SEARCH,
  endSearch,
  SET_ROOM_ID,
  setRoomId,
  SET_PLAYBACK,
  setPlayback,
  UPDATE_PLAYBACK,
  updatePlayback,
};
