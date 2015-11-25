var path = require('path');
module.exports = {
  entry: './src/regions.module.js',
  output: {
    path: __dirname,
    filename: 'dist/regions.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader', 'ng-annotate']
      }
    ]
  }
};
