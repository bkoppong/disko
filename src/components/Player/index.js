import React from 'react';

import { isBrowser } from 'react-device-detect';

import MobilePlayer from './MobilePlayer';
import DesktopPlayer from './DesktopPlayer';

import './index.css';

const Player = () => {
  if (!isBrowser) {
    return <MobilePlayer />;
  }

  return <DesktopPlayer />;
};

export default React.memo(Player);
