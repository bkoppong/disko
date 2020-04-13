// import React, {
// 	useEffect,
// 	useState,
// 	useCallback,
// 	useMemo,
// 	useRef,
// } from 'react';
//
// import { useSpotify } from './useSpotify';
//
// const emptyTrack = {
// 	artists: '',
// 	durationMs: 0,
// 	id: '',
// 	image: '',
// 	name: '',
// 	uri: '',
// };
//
// const setAlbumImage = (album) => {
// 	const width = Math.min(...album.images.map((d) => d.width));
// 	const thumb = album.images.find((d) => d.width === width) || {};
//
// 	return thumb.url;
// };
//
// const STATUS = {
// 	ERROR: 'ERROR',
// 	IDLE: 'IDLE',
// 	INITIALIZING: 'INITIALIZING',
// 	READY: 'READY',
// 	RUNNING: 'RUNNING',
// 	UNSUPPORTED: 'UNSUPPORTED',
// };
//
// const TYPE = {
// 	DEVICE: 'device_update',
// 	PLAYER: 'player_update',
// 	STATUS: 'status_update',
// 	TRACK: 'track_update',
// };
//
// const useSpotifyWebPlaybackSDK = ({ token, callback }) => {
// 	const spotify = useSpotify();
//
// 	const player = useRef(null);
// 	const [playerState, setPlayerState] = useState({
// 		currentDeviceId: '',
// 		deviceId: '',
// 		devices: [],
// 		error: '',
// 		errorType: '',
// 		isActive: false,
// 		isInitializing: false,
// 		isMagnified: false,
// 		isPlaying: false,
// 		isSaved: false,
// 		isUnsupported: false,
// 		needsUpdate: false,
// 		nextTracks: [],
// 		position: 0,
// 		previousTracks: [],
// 		status: STATUS.IDLE,
// 		track: emptyTrack,
// 		volume: 1,
// 	});
//
// 	const handlePlayerStateChange = useCallback(async (stateChange) => {
// 		if (stateChange) {
// 			const isPlaying = !stateChange.paused;
// 			const {
// 				album,
// 				artists,
// 				duration_ms,
// 				id,
// 				name,
// 				uri,
// 			} = stateChange.track_window.current_track;
// 			const volume = await player.current.getVolume();
// 			const track = {
// 				artists: artists.map((d) => d.name).join(', '),
// 				durationMs: duration_ms,
// 				id,
// 				image: setAlbumImage(album),
// 				name,
// 				uri,
// 			};
// 			setPlayerState({
// 				error: '',
// 				errorType: '',
// 				isActive: true,
// 				isPlaying,
// 				nextTracks: stateChange.track_window.next_tracks,
// 				previousTracks: stateChange.track_window.previous_tracks,
// 				track,
// 				volume,
// 			});
// 		}
// 	}, []);
//
// 	useEffect(() => {
// 		const initializePlayer = () => {
// 			player.current = new window.Spotify.Player({
// 				name: 'Disko Player',
// 				getOAuthToken: (cb) => {
// 					cb(token);
// 				},
// 				volume: 1.0,
// 			});
//
// 			player.current.addListener(
// 				'initialization_error',
// 				({ message }) => {
// 					console.error(message);
// 				},
// 			);
// 			player.current.addListener(
// 				'authentication_error',
// 				({ message }) => {
// 					console.error(message);
// 				},
// 			);
// 			player.current.addListener('account_error', ({ message }) => {
// 				console.error(message);
// 			});
// 			player.current.addListener('playback_error', ({ message }) => {
// 				console.error(message);
// 			});
// 			// Playback status updates
// 			player.current.addListener('player_state_changed', (state) => {
// 				console.log(state);
// 			});
// 			// Ready
// 			player.current.addListener('ready', ({ device_id }) => {
// 				console.log('Ready with Device ID', device_id);
// 			});
// 			// Not Ready
// 			player.current.addListener('not_ready', ({ device_id }) => {
// 				console.log('Device ID has gone offline', device_id);
// 			});
// 			player.current.addListener(
// 				'player_state_changed',
// 				handlePlayerStateChange,
// 			);
//
// 			const connectionResult = player.current.connect();
// 			console.log(player.current);
// 		};
//
// 		window.onSpotifyWebPlaybackSDKReady = initializePlayer;
//
// 		const terminatePlayer = () => {
// 			if (player.current) {
// 				player.current.disconnect();
// 			}
// 		};
//
// 		return terminatePlayer;
// 	}, [token, handlePlayerStateChange]);
//
// 	useEffect(() => {
// 		const script = document.createElement('script');
// 		script.src = 'https://sdk.scdn.co/spotify-player.js';
// 		document.body.appendChild(script);
//
// 		return () => {
// 			document.body.removeChild(script);
// 		};
// 	}, []);
//
// 	return <div />;
// };
//
// export default React.memo(SpotifyWebPlaybackSDK);
