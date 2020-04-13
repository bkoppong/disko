import React, { lazy } from 'react';

import { useDispatch } from 'react-redux';

import { Col } from 'antd';

import RoomBody from './RoomBody';
import RoomFooter from './RoomFooter';
import SearchBar from '../SearchBar';
import LoadingPage from '../LoadingPage';
import RoomHeader from './RoomHeader';

import './index.css';

import { setRoomId } from '../../redux/actions';

import { useRoom } from '../../hooks';

const GuestTooltip = lazy(() => import('./GuestTooltip'));

const Room = ({ roomId }) => {
  const dispatch = useDispatch();
  dispatch(setRoomId(roomId));

  const { id: queriedRoomId } = useRoom();
  if (!queriedRoomId) {
    return <LoadingPage />;
  }

  return (
    <Col
      xs={24}
      md={12}
      lg={10}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <RoomHeader />
      <SearchBar />
      <GuestTooltip />
      <RoomBody />
      <RoomFooter />
    </Col>
  );
};

export default Room;
