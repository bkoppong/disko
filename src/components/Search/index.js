import React from 'react';

import { Row, Typography, List } from 'antd';

import { Search as SearchIcon } from 'react-feather';

import LoadingPage from '../LoadingPage';

const { Title } = Typography;

const Search = props => {
  const { searchResults, searchLoading } = props;

  return (
    <>
      <Row>
        <Title
          level={4}
          style={{
            color: 'white',
          }}
        >
          Search
        </Title>
      </Row>
      {!searchResults.length && (
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{
            height: '200px',
          }}
        >
          {searchLoading && <LoadingPage />}
          {!searchLoading && <SearchIcon size={50} color="white" />}
        </Row>
      )}
      {searchResults.length && !searchLoading && (
        <List size="small">{searchResults}</List>
      )}
    </>
  );
};

export default Search;
