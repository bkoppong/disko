// import React, {
// 	useEffect,
// 	useState,
// 	useCallback,
// 	useMemo,
// 	useRef,
// } from 'react';
//
// import { useDispatch } from 'react-redux';
//
// import { useSpotify } from '../../hooks';
//
// import PlayerController from '../Player/PlayerController';
//
// import { setPlayback } from '../../redux/actions';
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
// const SpotifyWebPlaybackSDK = ({ spotify, callback }) => {
// 	// console.log('sdk render');
// 	const dispatch = useDispatch();
// 	const [spotifyWorks, setSpotifyWorks] = useState(false);
// 	const [initialized, setInitialized] = useState(false);
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
// 	useEffect(() => {
// 		if (!spotifyWorks) {
// 			const testSpotify = async () => {
// 				let newSpotifyWorks = false;
// 				try {
// 					const meResponse = await spotify.getMe();
// 					newSpotifyWorks = true;
// 				} catch (error) {
// 					newSpotifyWorks = false;
// 				} finally {
// 					if (newSpotifyWorks !== spotifyWorks) {
// 						setSpotifyWorks(newSpotifyWorks);
// 					}
// 				}
// 			};
// 			testSpotify();
// 		}
// 	}, [spotify, spotifyWorks]);
//
// 	const syncDevice = useCallback(async () => {
// 		const currentPlaybackState = await spotify.getMyCurrentPlaybackState();
// 		console.log(currentPlaybackState);
// 		// let track = emptyTrack;
// 		// if (currentPlaybackState.item) {
// 		//   track = currentPlaybackState.item;
// 		// }
// 		// setPlayerState({
// 		//   track: track,
// 		// });
// 	}, [spotify]);
//
// 	const transferPlayback = useCallback(
// 		(deviceId) => {
// 			spotify.transferMyPlayback(
// 				[deviceId],
// 				{
// 					play: false,
// 				},
// 				(error, response) => {
// 					// console.log(response);
// 					// console.error(error);
// 				},
// 			);
// 		},
// 		[spotify],
// 	);
//
// 	const handlePlayerStateChange = useCallback(
// 		async (stateChange) => {
// 			console.log(stateChange);
// 			if (stateChange) {
// 				const isPlaying = !stateChange.paused;
// 				const {
// 					album,
// 					artists,
// 					duration_ms,
// 					id,
// 					name,
// 					uri,
// 				} = stateChange.track_window.current_track;
// 				const volume = await player.current.getVolume();
// 				const item = {
// 					artists: artists.map((d) => d.name).join(', '),
// 					durationMs: duration_ms,
// 					id,
// 					image: setAlbumImage(album),
// 					name,
// 					uri,
// 				};
// 				const newPlayerState = {
// 					error: '',
// 					errorType: '',
// 					isActive: true,
// 					isPlaying,
// 					nextTracks: stateChange.track_window.next_tracks,
// 					previousTracks: stateChange.track_window.previous_tracks,
// 					item,
// 					volume,
// 				};
// 				syncDevice();
// 				setPlayerState(newPlayerState);
// 				dispatch(setPlayback(newPlayerState));
// 			}
// 		},
// 		[syncDevice, dispatch],
// 	);
//
// 	useEffect(() => {
// 		if (spotifyWorks) {
// 			const token = spotify.getAccessToken();
// 			const initializePlayer = () => {
// 				player.current = new window.Spotify.Player({
// 					name: 'Disko Player',
// 					getOAuthToken: (cb) => {
// 						cb(token);
// 					},
// 					volume: 1.0,
// 				});
//
// 				player.current.addListener(
// 					'initialization_error',
// 					({ message }) => {
// 						console.error(message);
// 					},
// 				);
// 				player.current.addListener(
// 					'authentication_error',
// 					({ message }) => {
// 						console.error(message);
// 					},
// 				);
// 				player.current.addListener('account_error', ({ message }) => {
// 					console.error(message);
// 				});
// 				player.current.addListener('playback_error', ({ message }) => {
// 					console.error(message);
// 				});
// 				// Playback status updates
// 				player.current.addListener(
// 					'player_state_changed',
// 					handlePlayerStateChange,
// 				);
// 				// Ready
// 				player.current.addListener('ready', ({ device_id }) => {
// 					console.log('Spotify SDK initialized.');
// 					transferPlayback(device_id);
// 				});
// 				// Not Ready
// 				player.current.addListener('not_ready', ({ device_id }) => {
// 					console.log('Device ID has gone offline', device_id);
// 				});
//
// 				const connectionResult = player.current.connect();
// 			};
//
// 			const terminatePlayer = () => {
// 				if (player.current) {
// 					player.current.disconnect();
// 				}
// 			};
// 			window.onSpotifyWebPlaybackSDKReady = initializePlayer;
// 			setInitialized(true);
// 			return terminatePlayer;
// 		}
// 	}, [spotify, spotifyWorks, handlePlayerStateChange, transferPlayback]);
//
// 	useEffect(() => {
// 		if (initialized) {
// 			const script = document.createElement('script');
// 			script.src = 'https://sdk.scdn.co/spotify-player.js';
// 			document.body.appendChild(script);
//
// 			return () => {
// 				document.body.removeChild(script);
// 			};
// 		}
// 	}, [initialized]);
//
// 	return <PlayerController />;
// };
//
// export default React.memo(SpotifyWebPlaybackSDK);
