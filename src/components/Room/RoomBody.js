import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Queue from '../Queue';
import Search from '../Search';

const RoomBody = () => {
  const [body, setBody] = useState(<Queue />);
  const searchEnabled = useSelector((state) => state.search.searchEnabled);
  useEffect(() => {
    if (searchEnabled) {
      setBody(<Search />);
    } else {
      setBody(<Queue />);
    }
  }, [searchEnabled]);
  return body;
};

export default RoomBody;
