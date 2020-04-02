import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase';

import { Redirect } from 'react-router-dom';

import {
  Row,
  Col,
  Typography,
  Affix,
  Button,
  Dropdown,
  Menu,
  Tooltip,
} from 'antd';

import { Share, Link, Users } from 'react-feather';

import Img from 'react-image';

import Queue from '../Queue';
import SearchResults from '../SearchResults';
import NewRequest from '../NewRequest';
import Player from '../Player';

// import backgroundImage from './background.jpg';
import qrIcon from './qrIcon.svg';

import './index.css';

const { Title } = Typography;

const Room = props => {
  const { roomId, hostActionComponents, ...rest } = props;

  const { hostProviders } = rest;

  const auth = useSelector(state => state.firebase.auth);

  const renderPlayer = () => {
    if (!hostProviders) {
      return null;
    }
    return <Player roomId={roomId} {...rest} />;
  };

  const roomReference = `rooms.${roomId}`;

  const roomDataQuery = {
    collection: 'rooms',
    doc: roomId,
    storeAs: roomReference,
  };

  const firestore = useFirestore();

  useFirestoreConnect([roomDataQuery]);

  const roomSelector = useSelector(
    state => state.firestore.ordered[roomReference],
  );

  const guestDisplayNameReference = 'guestDisplayNames';
  const guestDisplayNameSelector = useSelector(
    state => state.firestore.ordered[guestDisplayNameReference],
  );

  const [urlCopiedTooltipVisible, setUrlCopiedTooltipVisible] = useState(false);

  const showUrlCopiedTooltip = () => {
    setUrlCopiedTooltipVisible(true);
    setTimeout(() => {
      setUrlCopiedTooltipVisible(false);
    }, 3000);
  };

  const [searchData, setSearchData] = useState({
    searchEnabled: false,
    searchLoading: false,
    searchResults: [],
  });

  const updateSearchData = updateObject => {
    const updatedObject = {};
    Object.assign(updatedObject, searchData);
    Object.assign(updatedObject, updateObject);
    setSearchData(updatedObject);
  };

  if (!isLoaded(roomSelector)) {
    return null;
  }

  const roomDoesNotExist = isEmpty(roomSelector);

  if (roomDoesNotExist) {
    return <Redirect to="/" />;
  }

  const room = roomSelector[0];

  if (
    isLoaded(guestDisplayNameSelector) &&
    !isEmpty(guestDisplayNameSelector)
  ) {
    const arrayUnion = firestore.FieldValue.arrayUnion;
    // const arrayRemove = firestore.FieldValue.arrayRemove;
    const roomUpdateReference = firestore.collection('rooms').doc(roomId);
    const guestDisplayName = guestDisplayNameSelector[0].displayName;
    const roomUpdateObject = {};

    if (!room.guestUids.includes(auth.uid)) {
      roomUpdateObject.guestUids = arrayUnion(auth.uid);
    }
    if (
      guestDisplayName &&
      !room.guestDisplayNames.includes(guestDisplayName)
    ) {
      roomUpdateObject.guestDisplayNames = arrayUnion(guestDisplayName);
    }
    if (Object.keys(roomUpdateObject).length !== 0) {
      roomUpdateReference.update(roomUpdateObject);
    }
  }

  const guestToolTipText = (
    <div>
      <div
        key="host_tooltip_item"
        style={{
          textAlign: 'right',
          color: '#f01dbb',
        }}
      >
        {room.hostDisplayName}
      </div>
      {room.guestDisplayNames.map(displayName => (
        <div
          key={`${displayName}_tooltip_item`}
          style={{
            textAlign: 'right',
          }}
        >
          {displayName}
        </div>
      ))}
    </div>
  );

  const roomUrl = `disko.vip/room/${roomId.toLowerCase()}`;

  const handleCopyUrlToClipboard = () => {
    const roomUrlElement = document.createElement('input');
    roomUrlElement.height = 0;
    roomUrlElement.width = 0;
    roomUrlElement.value = roomUrl;
    document.body.appendChild(roomUrlElement);
    roomUrlElement.select();
    document.execCommand('copy');
    document.body.removeChild(roomUrlElement);
    showUrlCopiedTooltip();
  };

  const { searchEnabled, searchLoading, searchResults } = searchData;

  const renderBody = () => {
    const body = searchEnabled ? (
      <SearchResults
        searchResults={searchResults}
        searchLoading={searchLoading}
      />
    ) : (
      <Queue {...props} />
    );
    return (
      <Col
        style={{
          paddingBottom: '80px',
        }}
      >
        {body}
      </Col>
    );
  };

  return (
    <Col
      xs={24}
      md={12}
      lg={10}
      style={
        {
          // minHeight: '100vh',
          // maxHeight: '100vh',
          // overflowY: 'scroll',
          // backgroundImage: `url(${backgroundImage})`,
          // backgroundRepeat: 'no-repeat',
          // backgroundSize: 'cover',
        }
      }
    >
      <Row
        type="flex"
        align="middle"
        justify="space-between"
        style={{
          paddingTop: '25px',
        }}
      >
        <Col>
          <Title
            level={2}
            style={{
              color: 'white',
            }}
          >
            disko
          </Title>
        </Col>
        <Col>
          <Row type="flex" align="middle" justify="end">
            <Col>{hostActionComponents}</Col>
            <Col>
              <Tooltip
                placement="leftBottom"
                visible={urlCopiedTooltipVisible}
                title={<span>Room URL copied to clipboard!</span>}
              >
                <Dropdown
                  overlay={
                    <Menu
                      style={{
                        backgroundColor: '#191414',
                        zIndex: '10',
                      }}
                    >
                      <Menu.Item onClick={handleCopyUrlToClipboard}>
                        <Link color="white" />
                      </Menu.Item>
                      {
                        // <Menu.Item>
                        //   <Img src={qrIcon} />
                        // </Menu.Item>
                      }
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button type="link">
                    <Share />
                  </Button>
                </Dropdown>
              </Tooltip>
            </Col>
            <Col>
              <Title
                level={2}
                style={{
                  color: 'white',
                  float: 'right',
                }}
              >
                {roomId.toLowerCase()}
              </Title>
            </Col>
          </Row>
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
            room={room}
            updateSearchData={updateSearchData}
            {...rest}
          />
        </Row>
      </Affix>
      <Affix
        style={{
          height: '0px',
          textAlign: 'right',
        }}
        offsetTop={60}
      >
        <Tooltip
          trigger={['hover', 'click']}
          placement="bottomRight"
          title={guestToolTipText}
        >
          <Users
            style={{
              color: 'white',
              position: 'relative',
              zIndex: '999',
            }}
          />
        </Tooltip>
      </Affix>
      {renderBody()}
      {renderPlayer()}
    </Col>
  );
};

export default Room;
