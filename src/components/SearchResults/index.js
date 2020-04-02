import React from 'react';

import { Row, List } from 'antd';

import { Search as SearchIcon } from 'react-feather';

import LoadingPage from '../LoadingPage';

import SearchItem from '../SearchItem';

const SearchResults = props => {
  const { searchData } = props;

  const { searchResults, searchLoading } = searchData;

  if (searchLoading) {
    return <LoadingPage />;
  }

  if (!searchResults || !searchResults.length) {
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{
          height: '200px',
        }}
      >
        <SearchIcon size={50} color="white" />
      </Row>
    );
  }

  return (
    <List size="small">
      {searchResults.map(result => {
        const { track, handleSelectResult } = result;

        return (
          <SearchItem
            key={track.uri}
            onClick={handleSelectResult}
            track={track}
          />
        );
      })}
    </List>
  );
};

export default SearchResults;
