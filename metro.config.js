const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, '../node_modules')];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'axios') {
    return context.resolveRequest(
      context,
      'axios/dist/browser/axios.cjs',
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};
config.resolver.extraNodeModules = {
  'react-native': path.resolve(__dirname, '../node_modules/react-native'),
};

module.exports = config;
