import { useState, useEffect, useCallback } from 'react';

import { useSelector } from 'react-redux';

import { useFirestore } from 'react-redux-firebase';

import { debounce } from 'throttle-debounce';

import useSpotify from './useSpotify';
import useHostProviderInfo from './useHostProviderInfo';
import useRequests from './useRequests';

import { isEqualArray } from '../constants';

const useSpotifyPlaylist = () => {
  const [playlistData, setPlaylistData] = useState({
    id: '',
    uri: '',
  });
  const [songs, setSongs] = useState([]);

  const { all } = useRequests();

  const firestore = useFirestore();
  const spotify = useSpotify();
  const auth = useSelector((state) => state.firebase.auth);

  const hostProviderInfo = useHostProviderInfo();

  useEffect(() => {
    if (hostProviderInfo) {
      const playlistUri = hostProviderInfo.playlistUri;
      if (playlistUri && playlistUri !== playlistData.uri) {
        const playlistId = playlistUri.split(':')[2];
        setPlaylistData({
          uri: playlistUri,
          id: playlistId,
        });
      }
    }
  }, [hostProviderInfo, playlistData]);

  const createPlaylist = useCallback(async () => {
    // Check for Disko Queue Playlist
    let playlistResponse = await spotify.getUserPlaylists();
    let diskoQueuePlaylist = playlistResponse.items.find(
      (playlist) => playlist.name === 'Disko Queue',
    );
    if (diskoQueuePlaylist) {
      return firestore
        .collection('hosts')
        .doc(auth.uid)
        .collection('providers')
        .doc('spotify')
        .update({
          playlistUri: diskoQueuePlaylist.uri,
        });
    }
    while (playlistResponse.next) {
      playlistResponse = await spotify.getGeneric(playlistResponse.next);
      diskoQueuePlaylist = playlistResponse.items.find(
        (playlist) => playlist.name === 'Disko Queue',
      );
      if (diskoQueuePlaylist) {
        return firestore
          .collection('hosts')
          .doc(auth.uid)
          .collection('providers')
          .doc('spotify')
          .update({
            playlistUri: diskoQueuePlaylist.uri,
          });
      }
    }

    // Create Disko Queue playlist
    const meResponse = await spotify.getMe();
    const userId = meResponse.id;

    const playlistCreationResponse = await spotify.createPlaylist(userId, {
      name: 'Disko Queue',
      public: false,
      description: 'Queue songs with your friends at disko.vip',
    });
    diskoQueuePlaylist = playlistCreationResponse;
    return firestore
      .collection('hosts')
      .doc(auth.uid)
      .collection('providers')
      .doc('spotify')
      .update({
        playlistUri: diskoQueuePlaylist.uri,
      });
  }, [spotify, firestore, auth.uid]);

  // Move this to FB Funcs
  useEffect(() => {
    if (!playlistData) {
      createPlaylist();
    }
  }, [playlistData, createPlaylist]);

  const debouncedReplaceTracks = useCallback(
    debounce(350, spotify.replaceTracksInPlaylist),
    [spotify],
  );

  useEffect(() => {
    const playlistId = playlistData.id;
    if (playlistId && all) {
      // const playedRequestUris = played.map(request => request.id);
      const allRequestUris = all.map((request) => request.id);
      // const allRequestUris = playedRequestUris.concat(notPlayedRequestUris);
      if (!isEqualArray(allRequestUris, songs)) {
        setSongs(allRequestUris);
        debouncedReplaceTracks(playlistId, allRequestUris);
      }
    }
  }, [playlistData, all, songs, debouncedReplaceTracks]);

  return {
    songs,
    ...playlistData,
  };
};

export default useSpotifyPlaylist;
