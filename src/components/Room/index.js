import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

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

import { Share, Link } from 'react-feather';

import Img from 'react-image';

import Queue from '../Queue';
import Search from '../Search';
import NewRequest from '../NewRequest';

// import backgroundImage from './background.jpg';
import qrIcon from './qrIcon.svg';

const { Title } = Typography;

const Room = props => {
  const { roomId, hostActionComponents, ...rest } = props;

  const roomReference = `rooms.${roomId}`;

  const roomDataQuery = {
    collection: 'rooms',
    doc: roomId,
    storeAs: roomReference,
  };

  useFirestoreConnect([roomDataQuery]);

  const roomSelect = useSelector(
    state => state.firestore.ordered[roomReference],
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

  // const roomExists = isLoaded(roomSelect) && !isEmpty(roomSelect);
  const roomDoesNotExist = isLoaded(roomSelect) && isEmpty(roomSelect);
  // const room = roomExists ? roomSelect[0] : null; // to get rsoom data like # participants, queue length etc

  if (roomDoesNotExist) {
    return <Redirect to="/" />;
  }

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
      <Search searchResults={searchResults} searchLoading={searchLoading} />
    ) : (
      <Queue {...props} />
    );
    return body;
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
                      <Menu.Item>
                        <Img src={qrIcon} />
                      </Menu.Item>
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
            roomId={roomId}
            updateSearchData={updateSearchData}
            {...rest}
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
        }}
      >
        <Col
          span={24}
          style={
            {
              // marginBottom: '80px',
            }
          }
        />
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
