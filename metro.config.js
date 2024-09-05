const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    blacklistRE: /node_modules\/.*\/node_modules\/react-native\/.*/,
  },
};
