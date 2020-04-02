import React from 'react';

import { Row, Typography } from 'antd';

import SearchResults from '../SearchResults';

const { Title } = Typography;

const Search = props => {
  const { searchData } = props;

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
      <SearchResults searchData={searchData} />
    </>
  );
};

export default Search;
