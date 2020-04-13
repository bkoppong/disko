import React, { useState, useEffect } from 'react';

import { Row, Col, Typography } from 'antd';

import Img from 'react-image';

import { useRoom, useSpotify } from '../../hooks';

const setAlbumImage = (album) => {
  const width = Math.min(...album.images.map((d) => d.width));
  const thumb = album.images.find((d) => d.width === width) || {};

  return thumb.url;
};

const RoomCurrentlyPlaying = () => {
  const { currentlyPlaying } = useRoom();
  const spotify = useSpotify();
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState(null);

  // const accessToken = spotify.getAccessToken();

  useEffect(() => {
    if (spotify.getAccessToken() && currentlyPlaying) {
      const getTrackInfo = async () => {
        const trackId = currentlyPlaying.split(':')[2];
        const currentTrack = await spotify.getTrack(trackId);
        setCurrentlyPlayingTrack(currentTrack);
      };
      getTrackInfo();
    }
  }, [spotify, currentlyPlaying]);

  if (!currentlyPlayingTrack) {
    return null;
  }

  const {
    artists,
    name,
    album,
    // uri,
  } = currentlyPlayingTrack;

  const albumImageUrl = setAlbumImage(album);
  const artistsString = artists.map((artist) => artist.name).join(', ');

  return (
    <Row type="flex" className="currently_playing" align="middle">
      <Col>
        <Img src={albumImageUrl} />
      </Col>
      <Col flex={1}>
        <Row>
          <Typography.Text>{name}</Typography.Text>
        </Row>
        <Row>
          <Typography.Text
            style={{
              fontSize: '.6em',
            }}
          >
            {artistsString}
          </Typography.Text>
        </Row>
      </Col>
    </Row>
  );
};

export default RoomCurrentlyPlaying;
