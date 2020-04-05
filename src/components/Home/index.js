import React, { useState } from 'react';

import { Link, useHistory } from 'react-router-dom';

import { Row, Col, Button, Input, Typography } from 'antd';

import Img from 'react-image';

import './index.css';

import diskoBall from '../../assets/img/disko_ball_gif.gif';

const { Title } = Typography;

const Home = props => {
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const history = useHistory();

  const handleRoomIdInputChange = event => {
    setRoomIdToJoin(event.target.value);
  };

  const handleJoinRoom = () => {
    if (roomIdToJoin) {
      history.push(`/room/${roomIdToJoin.toLowerCase()}`);
    }
  };

  const roomJoinButtonDisabled = false;

  return (
    <Row
      type="flex"
      justify="center"
      align="stretch"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <Col xs={24} md={12} lg={10}>
        <Row
          type="flex"
          justify="center"
          style={{
            width: '100%',
            marginBottom: '30px',
            marginTop: '35px',
          }}
        >
          <Col align="middle">
            <Img
              src={diskoBall}
              style={{
                objectFit: 'cover',
                maxWidth: '40vmin',
                maxHeight: '40vmin',
                height: 'auto',
                width: 'auto',
              }}
            />
            <Title
              style={{
                color: 'white',
              }}
            >
              disko
            </Title>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: '30px',
          }}
        >
          <Input
            className="room-code-input"
            placeholder="Enter a room code..."
            onChange={handleRoomIdInputChange}
            onPressEnter={handleJoinRoom}
          />
        </Row>
        <Row
          type="flex"
          justify="center"
          style={{
            marginBottom: '30px',
          }}
        >
          <Button
            type="primary"
            onClick={handleJoinRoom}
            disabled={roomJoinButtonDisabled}
            block
            style={{
              height: '80px',
              fontSize: '2em',
            }}
          >
            JOIN
          </Button>
        </Row>
        <Row
          type="flex"
          justify="center"
          style={{
            marginBottom: '30px',
          }}
        >
          <Col flex="auto">
            <Link to="/host">
              <Button
                type="link"
                style={{
                  fontSize: '2em',
                }}
              >
                HOST
              </Button>
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Home;
