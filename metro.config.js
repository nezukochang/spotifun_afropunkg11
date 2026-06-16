const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customResolveRequest = (context, moduleName, platform) => {
  // AsyncStorage's package exposes a React Native entrypoint to TypeScript sources.
  // Metro may struggle to resolve that path in this RN 0.76 project, so redirect
  // the package root to the built CommonJS entrypoint instead.
  if (moduleName === '@react-native-async-storage/async-storage') {
    return context.resolveRequest(
      context,
      '@react-native-async-storage/async-storage/lib/commonjs/index.js',
      platform
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

const config = {
  resolver: {
    resolveRequest: customResolveRequest,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
