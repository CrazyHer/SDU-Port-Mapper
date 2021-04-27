const path = require('path');

const { name } = require('./package.json');
module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.ts',
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: `${name}.js`,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [],
};
