import { UPDATE_SEARCH_DATA, START_SEARCH, END_SEARCH } from '../actions';

const initialState = {
  inputValue: '',
  searchEnabled: false,
  searchLoading: false,
  searchResults: [],
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_DATA: {
      const updateObject = action.payload;
      const updatedObject = {};
      Object.assign(updatedObject, state);
      Object.assign(updatedObject, updateObject);
      return updatedObject;
    }
    case START_SEARCH: {
      const updatedObject = {};
      Object.assign(updatedObject, initialState);
      Object.assign(updatedObject, {
        searchEnabled: true,
      });
      return updatedObject;
    }
    case END_SEARCH: {
      document.getElementById('disko_search_bar').blur();
      return initialState;
    }
    default:
      return state;
  }
};

export default searchReducer;
