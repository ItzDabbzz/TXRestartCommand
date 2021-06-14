const webpack = require("webpack");
const path = require("path");

function getEntry(isServer) {
  return isServer ? "./src/server/server.js" : "./src/client/client.js";
}

function getFilename(isServer) {
  return isServer ? "server.js" : "client.js";
}

function getOutputPath(isServer) {
  return isServer
    ? // TODO: make this prod ready.
      path.resolve(__dirname, "./server-restart", "server")
    : path.resolve(__dirname, "./server-restart", "client");
}

function getPlugins(isServer) {
  return isServer ? [new webpack.DefinePlugin({ "global.GENTLY": false })] : [];
}

const config = (isServer) => ({
  entry: getEntry(isServer),
  output: {
    filename: getFilename(isServer),
    path: getOutputPath(isServer),
    rules: [
      {
      test: /\.json$/,
      exclude: [
          './src/server/config.json'
          ]
      }
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  optimization: {
    minimize: false,
  },
  target: isServer ? "node" : undefined,
  plugins: [
    new webpack.ContextReplacementPlugin(/any-promise|follow-redirects/),
    ...getPlugins(isServer),
  ],
  mode: "production",
  stats: {
    errorDetails: true,
  },
});

module.exports = [config(true), config(false)];
