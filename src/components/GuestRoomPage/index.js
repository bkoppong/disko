import React from 'react';

import { useParams } from 'react-router-dom';

import Room from '../Room';

const GuestRoomPage = props => {
  let { roomId } = useParams();

  roomId = roomId.toUpperCase();

  return <Room roomId={roomId} {...props} />;
};

export default GuestRoomPage;
