const TerserPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = ​require​('lodash-webpack-plugin');

module.exports = {
  entry: './index.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
        },
        mangle: true,
      },
    })],
  },
};
