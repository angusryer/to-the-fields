const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    // Add the root path to the watch folders
    // This is required to make the monorepo work
    __dirname + '/../../',
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
