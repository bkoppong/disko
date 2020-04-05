import { UPDATE_SEARCH_DATA, START_SEARCH, END_SEARCH } from './actionTypes';

const updateSearchData = content => ({
  type: UPDATE_SEARCH_DATA,
  payload: content,
});

const startSearch = content => ({
  type: START_SEARCH,
});

const endSearch = content => ({
  type: END_SEARCH,
});

export {
  UPDATE_SEARCH_DATA,
  updateSearchData,
  START_SEARCH,
  startSearch,
  END_SEARCH,
  endSearch,
};
