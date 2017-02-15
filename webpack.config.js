const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    "vutlan_database_connector": './db_connector.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    libraryTarget: "umd",
    library: "vutlan_database_connector"
  },
  module: {
    rules: [
      {
          test: /\.js$/,
          options: { presets: ['es2015'] },
          loader: 'babel-loader',
          exclude: /node_modules/
      }
    ],
  },
  target: "node",
  externals: [nodeExternals()]
};