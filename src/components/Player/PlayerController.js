import React, { useCallback } from 'react';

import { useSelector } from 'react-redux';

import { isBrowser } from 'react-device-detect';

import { Row } from 'antd';
import { Pause, Play, SkipForward, SkipBack } from 'react-feather';

import { useSpotify, useRequests } from '../../hooks';

const PlayerController = () => {
  const spotify = useSpotify();
  const currentPlayback = useSelector((state) => state.playback);
  const { notPlayed } = useRequests();

  // const { notPlayed } = useRequests();
  // const [started, setStarted] = useState(false);
  // useEffect(() => {
  //   if (
  //     currentPlayback.isActive &&
  //     playlistUri &&
  //     spotify.getAccessToken() &&
  //     playlistSongs.length &&
  //     !started
  //   ) {
  //     console.log(playlistUri);
  //     setStarted(true);
  //     setTimeout(spotify.setVolume(0), 400);
  //     setTimeout(async () => {
  //       await spotify.play(
  //         {
  //           // 'device_id': currentPlayback.deviceId,
  //           'context_uri': playlistUri,
  //           // 'offset': {
  //           //   'position': 0,
  //           // },
  //           // 'position_ms': 0,
  //         }
  //       );
  //       await spotify.pause();
  //       await spotify.setShuffle(false)
  //     }, 800);
  //     setTimeout(async () => {
  //       await spotify.seek(0);
  //       await spotify.setVolume(100);
  //     }, 1200);
  //   }
  // }, [currentPlayback, playlistUri, playlistSongs, spotify, started]);

  const handleSkipToPrevious = useCallback(spotify.skipToPrevious, [spotify]);

  const handleSkipToNext = useCallback(async () => {
    if (isBrowser) {
      // queue up next song if exists
      if (notPlayed.length && !notPlayed[0].queued) {
        await spotify.addTrackToMyQueue(notPlayed[0].id);
      }
      // skip to it
      await spotify.skipToNext();
    } else {
      // normal skip
      await spotify.skipToNext();
    }
  }, [spotify, notPlayed]);

  const handlePause = useCallback(spotify.pause, [spotify]);
  const handlePlay = useCallback(spotify.play, [spotify]);

  const pauseOrPlayButton =
    currentPlayback.isPlaying || currentPlayback.is_playing ? (
      <Pause onClick={handlePause} />
    ) : (
      <Play onClick={handlePlay} />
    );

  return (
    <Row
      type="flex"
      align="middle"
      justify="space-around"
      className="disko-player"
    >
      <SkipBack onClick={handleSkipToPrevious} />
      {pauseOrPlayButton}
      <SkipForward onClick={handleSkipToNext} />
    </Row>
  );
};

export default PlayerController;
