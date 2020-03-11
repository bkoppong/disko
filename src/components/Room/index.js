import React, { useState } from 'react'

import {
  useSelector,
} from 'react-redux';

import {
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase';

import {
  Redirect,
} from 'react-router-dom';

import {
  Row,
  Col,
  List,
  Typography,
  Affix,
} from 'antd';

import Queue from '../Queue';
import Search from '../Search';
import NewRequest from '../NewRequest';

// import backgroundImage from './background.jpg';

const { Title } = Typography;

const Room = props => {

  const {
    roomId,
  } = props;

  const roomReference = `rooms.${roomId}`;

  const roomDataQuery = {
    collection: 'rooms',
    doc: roomId,
    storeAs: roomReference,
  };

  useFirestoreConnect([
    roomDataQuery,
  ]);

  const roomSelect = useSelector(state => state.firestore.ordered[roomReference]);

  const [searchData, setSearchData] = useState({
    searchEnabled: false,
    searchLoading: false,
    searchResults: [],
  });

  const updateSearchData = (updateObject) => {
    let updatedObject = {};
    Object.assign(updatedObject, searchData);
    Object.assign(updatedObject, updateObject);
    setSearchData(updatedObject);
  };

  // const roomExists = isLoaded(roomSelect) && !isEmpty(roomSelect);
  const roomDoesNotExist = isLoaded(roomSelect) && isEmpty(roomSelect);
  // const room = roomExists ? roomSelect[0] : null; // to get room data like # participants, queue length etc

  if (roomDoesNotExist) {
    return <Redirect to="/" />;
  }

  const {
    searchEnabled,
    searchLoading,
    searchResults,
  } = searchData;

  const renderBody = () => {
    const body = searchEnabled ?
      <Search
        searchResults={searchResults}
        searchLoading={searchLoading}
      /> :
      <Queue
        roomId={roomId}
      />;
    return body;
  };

  return (
    <Col
      xs={24}
      md={12}
      lg={10}
      style={{
        // minHeight: '100vh',
        // maxHeight: '100vh',
        // overflowY: 'scroll',
        // backgroundImage: `url(${backgroundImage})`,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
      }}
    >
        <Row
          style={{
            paddingTop: '25px',
          }}
        >
        <Col span={12}>
          <Title
            level={2}
            style={{
              color: 'white',
            }}
          >
            Disko
          </Title>
        </Col>
        <Col span={12}>
          <Title
            level={2}
            style={{
              color: 'white',
              float: 'right',
            }}
          >
            {roomId}
          </Title>
        </Col>

        </Row>
      <Affix>
        <Row
          style={{
            zIndex: '1',
            paddingTop: '15px',
            height: '60px',
            backgroundColor: '#191414',
          }}
        >
          <NewRequest
            roomId={roomId}
            updateSearchData={updateSearchData}
          />
        </Row>
      </Affix>
      {renderBody()}

      <Row
        type="flex"
        justify="center"
        style={{
          paddingTop: '10px',
          paddingBottom: '80px',
        }}>
        <Col
          span={24}
          style={{
            // marginBottom: '80px',
          }}
        >
        </Col>
      </Row>
    </Col>
  );
};

export default Room;

// <Affix offsetBottom={10}>
//   <Title
//     level={4}
//     style={{
//       color: 'white',
//     }}
//   >
//     Room {roomId}
//   </Title>
// </Affix>
