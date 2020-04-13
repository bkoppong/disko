import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { X } from 'react-feather';

import { endSearch } from '../../redux/actions';

const SearchSuffix = () => {
  const searchData = useSelector((state) => state.search);
  const { inputValue } = searchData;
  const dispatch = useDispatch();
  const end = useCallback(() => {
    dispatch(endSearch());
  }, [dispatch]);
  if (!inputValue) {
    return null;
  }
  return (
    <X
      size={12}
      style={{
        transform: 'scale(1.4)',
        // marginLeft: '-4px',
        // marginRight: '4px',
      }}
      onClick={end}
    />
  );
};

export default SearchSuffix;
