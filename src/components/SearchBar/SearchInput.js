import React from 'react';

import { useSelector } from 'react-redux';

import { isLoaded, isEmpty } from 'react-redux-firebase';

import { Search } from 'react-feather';

import { Input } from 'antd';

import SearchSuffix from './SearchSuffix';

const SearchInput = ({ onChange, onFocus, onBlur }) => {
  const auth = useSelector((state) => state.firebase.auth);
  const disabled = !isLoaded(auth) || isEmpty(auth);

  const inputValue = useSelector((state) => state.search.inputValue);
  return (
    <Input
      id="disko_search_bar"
      onChange={onChange}
      value={inputValue}
      placeholder="Queue a song..."
      maxLength={40}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      prefix={
        <Search
          size={12}
          style={{
            transform: 'scale(1.4)',
            // marginLeft: '-4px',
            marginRight: '4px',
          }}
        />
      }
      suffix={<SearchSuffix />}
      style={{
        width: '100%',
      }}
    />
  );
};

export default SearchInput;
