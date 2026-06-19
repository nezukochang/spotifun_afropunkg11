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

// Polyfill registerCallableModule for bridgeless mode (RN 0.76)
if (typeof AppRegistry.registerCallableModule !== 'function') {
  AppRegistry.registerCallableModule = function (name, getModule) {
    AppRegistry.registerHeadlessTask(name, getModule);
  };
}

// TrackPlayer handles headless task registration internally via registerPlaybackService.
TrackPlayer.registerPlaybackService(() => require('./src/services/audio/playerService').PlaybackService);
