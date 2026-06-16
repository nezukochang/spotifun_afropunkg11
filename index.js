/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./src/services/audio/playerService').PlaybackService);
