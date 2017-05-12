const path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, '../webapp/resources'),
    publicPath: 'resources/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style!css!less" },
      {
        test: /\.png$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  resolve: {
    alias: {
      source: __dirname+ '/src',
      customFiles: __dirname + '/src/custom_files',
      localesDir: __dirname + '/src/locales'
    },
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
