jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    GestureHandlerRootView: ({children, style}) => React.createElement(View, {style}, children),
    gestureHandlerRootHOC: component => component,
  };
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const {View, Text, ScrollView} = require('react-native');
  const AnimatedView = props => React.createElement(View, props, props.children);
  const AnimatedText = props => React.createElement(Text, props, props.children);
  const AnimatedScrollView = props => React.createElement(ScrollView, props, props.children);
  const chain = () => {
    const api = {};
    ['delay', 'duration', 'springify', 'damping', 'stiffness', 'mass'].forEach(key => {
      api[key] = () => api;
    });
    return api;
  };
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      Text: AnimatedText,
      ScrollView: AnimatedScrollView,
      createAnimatedComponent: component => component,
    },
    View: AnimatedView,
    Text: AnimatedText,
    ScrollView: AnimatedScrollView,
    FadeInUp: chain(),
    FadeInDown: chain(),
    FadeInRight: chain(),
    FadeOutLeft: chain(),
    SlideInUp: chain(),
    SlideInDown: chain(),
    SlideInRight: chain(),
    SlideOutDown: chain(),
    Layout: {springify: chain},
    useSharedValue: value => ({value}),
    useAnimatedStyle: factory => factory(),
    withRepeat: value => value,
    withTiming: value => value,
    withSequence: (...values) => values[values.length - 1],
    withSpring: value => value,
    withDelay: (_delay, value) => value,
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      inOut: easing => easing,
    },
    interpolate: (value, input, output) => {
      if (value <= input[0]) {
        return output[0];
      }
      return output[output.length - 1];
    },
    interpolateColor: (_value, _input, output) => output[0],
    runOnJS: fn => fn,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-track-player', () => {
  const State = {
    None: 'none',
    Ready: 'ready',
    Playing: 'playing',
    Paused: 'paused',
    Buffering: 'buffering',
  };
  return {
    __esModule: true,
    default: {
      setupPlayer: jest.fn(() => Promise.resolve()),
      updateOptions: jest.fn(() => Promise.resolve()),
      getCurrentTrack: jest.fn(() => Promise.resolve(null)),
      getState: jest.fn(() => Promise.resolve(State.None)),
      getActiveTrack: jest.fn(() => Promise.resolve(null)),
      getActiveTrackIndex: jest.fn(() => Promise.resolve(0)),
      getProgress: jest.fn(() => Promise.resolve({position: 0, duration: 0, buffered: 0})),
      add: jest.fn(() => Promise.resolve()),
      reset: jest.fn(() => Promise.resolve()),
      play: jest.fn(() => Promise.resolve()),
      pause: jest.fn(() => Promise.resolve()),
      skip: jest.fn(() => Promise.resolve()),
      skipToNext: jest.fn(() => Promise.resolve()),
      skipToPrevious: jest.fn(() => Promise.resolve()),
      seekTo: jest.fn(() => Promise.resolve()),
      remove: jest.fn(() => Promise.resolve()),
      setVolume: jest.fn(() => Promise.resolve()),
      addEventListener: jest.fn(() => ({remove: jest.fn()})),
    },
    useProgress: jest.fn(() => ({position: 0, duration: 0, buffered: 0})),
    State,
    Event: {
      PlaybackState: 'playback-state',
      PlaybackActiveTrackChanged: 'playback-active-track-changed',
      PlaybackQueueEnded: 'playback-queue-ended',
      RemotePause: 'remote-pause',
      RemotePlay: 'remote-play',
      RemoteNext: 'remote-next',
      RemotePrevious: 'remote-previous',
    },
    Capability: {
      Play: 'play',
      Pause: 'pause',
      SkipToNext: 'skip-to-next',
      SkipToPrevious: 'skip-to-previous',
      SeekTo: 'seek-to',
    },
    AppKilledPlaybackBehavior: {
      StopPlaybackAndRemoveNotification: 'stop-playback-and-remove-notification',
    },
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({isConnected: true, isInternetReachable: true})),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({children}) => React.createElement(React.Fragment, null, children),
    createNavigationContainerRef: () => ({
      current: null,
      isReady: () => false,
      navigate: jest.fn(),
      getCurrentRoute: jest.fn(() => ({name: 'Home'})),
    }),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: ({component: Component}) => {
      const React = require('react');
      return Component ? React.createElement(Component) : null;
    },
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: ({component: Component}) => {
      const React = require('react');
      return Component ? React.createElement(Component) : null;
    },
  }),
}));

jest.mock('react-native-ble-plx', () => ({
  BleManager: jest.fn(() => ({
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
    destroy: jest.fn(),
  })),
}));
