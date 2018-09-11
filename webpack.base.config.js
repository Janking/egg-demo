'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const extractReportSass = new ExtractTextPlugin('report-style.css')
const extractReportSass2 = new ExtractTextPlugin('report-style2.css');
const path = require('path');
// var extractFrontSass = new ExtractTextPlugin('front-style.css')
const extractFrontSass2 = new ExtractTextPlugin('front-style2.css');
const extractResetSass = new ExtractTextPlugin('reset-style.css');
const heatmapSass = new ExtractTextPlugin('heatmap-style.css');
const datashowSass = new ExtractTextPlugin('datashow-style.css');

function resolve(url) {
  return path.resolve(__dirname, './app/public', url);
}

const isDev = process.env.NODE_ENV !== 'development';
// const isDev = false

module.exports = {
  entry: {
    global: resolve('js/global'),
    report: resolve('js/report'),
    index: resolve('js/page/index'), // 首页
    register: resolve('js/page/register'), // 注册
    forgetPassword: resolve('js/page/forgetPassword'), // 忘记密码
    ranking: resolve('js/page/ranking'), // 排行榜
    userController: resolve('js/page/userController/index'), // 控制台
    main: resolve('js/report/main.js'), // 概况页
    onlineVisiter: resolve('js/report/onlineVisiter'), // 在线访问者
    client: resolve('js/report/client.js'),
    flowAnalysis: resolve('js/report/flowAnalysis'),
    contentAnalysis: resolve('js/report/contentAnalysis'),
    attractAnalysis: resolve('js/report/attractAnalysis'),
    download: resolve('js/report/download'),
    heatmapDraw: resolve('js/report/heatmapDraw'), // 绘制热力图
    heatmapAnalysis: resolve('js/report/heatmapAnalysis'), // 热力图页面js
    manageAnalysis: resolve('js/report/manageAnalysis'), // 设置
    uireset: resolve('js/uireset'), // 用户中心
    news: resolve('js/page/news'), // 排行榜
    datav: resolve('js/page/datav'), // 大屏数据
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    // publicPath: resolve('./asset/dist')
  },
  resolve: {
    modules: [ __dirname, 'node_modules' ],
    alias: { vue$: 'vue/dist/vue.common.js' },
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    // extractReportSass,
    extractReportSass2,
    // extractFrontSass,
    heatmapSass,
    extractFrontSass2,
    extractResetSass,
    datashowSass,
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [ 'env' ],
        },
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /front2\.scss$/,
        use: extractFrontSass2.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isDev,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceComments: true,
            },
          }],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /report2\.scss$/,
        use: extractReportSass2.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isDev,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceComments: true,
            },
          }],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /reset\.scss$/,
        use: extractResetSass.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isDev,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceComments: true,
            },
          }],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /heatmap\.scss$/,
        use: heatmapSass.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isDev,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceComments: true,
            },
          }],
          fallback: 'style-loader',
        }),
      },
      {
        test: /datashow\.scss$/,
        use: datashowSass.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isDev,
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceComments: true,
            },
          }],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
  },
};
