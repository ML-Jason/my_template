const path = require('path');
// const glob = require('glob');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: {
    'main.js': './src/main.js',
    'callback.js': './src/callback.js',
    'login.js': './src/login.js',
  },
  output: {
    // 發佈的路徑
    // path: path.resolve(__dirname, './dist/auth/js'),
    path: path.resolve(__dirname, '../server/public/js'),
    filename: '[name]',
    // 異步載入的路徑(以web為主的路徑)
    publicPath: '/js/',
    // 異步載入的檔案名
    chunkFilename: '[id].build.js?[chunkhash]',
  },
  dependencies: [
    path.join(__dirname, 'node_modules'),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            // scss: 'vue-style-loader!css-loader!sass-loader',
            // sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            js: 'babel-loader?presets[]=es2015,presets[]=stage-2',
          },
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'stage-2'],
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'vue-style-loader!css-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.min.js',
      'vue-router': 'vue-router/dist/vue-router.min.js',
      vuex: 'vuex/dist/vuex.min.js',
    },
  },
  plugins: [
    // ExtractTextPlugin好像無法用在lazy loading的組件上
    // new ExtractTextPlugin('../css/style.css'),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  devtool: 'source-map',
};

module.exports = config;

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}
