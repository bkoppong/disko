import React from 'react';

import { Row, Col, Typography } from 'antd';

import SearchResults from '../SearchResults';

const { Title } = Typography;

const Search = (props) => {
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
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{ flexGrow: '1' }}
      >
        <Col flex={1}>
          <SearchResults />
        </Col>
      </Row>
    </>
  );
};

export default Search;
