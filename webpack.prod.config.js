let merge = require('webpack-merge')
let baseConfig = require('./webpack.base.config')
let path = require('path')
let webpack = require('webpack')
let fs = require('fs')

// qiniu
// let QiniuPlugin = require('qiniu-webpack-plugin')

// let qiniuPlugin = new QiniuPlugin({
//   ACCESS_KEY : 'T-sJRpBtnzQCQjGm2ROvWOTh1vLGy6pZCC9vBJrf',
//   SECRET_KEY : '3_7wz4LylWDn0WrG5aY9sitT1TLowdpqIq10ZWlr',
//   bucket     : 'adimg',
//   path       : 'static'
// })

function readWriteSync() {
  let target = path.join(__dirname, './version.json')
  let str = fs.readFileSync(target, 'utf-8')
  let version = JSON.parse(str)
  version.version = +new Date()
  fs.writeFileSync(target, JSON.stringify(version), 'utf-8')
}

readWriteSync()

module.exports = merge(baseConfig, {
  output : {
    publicPath : 'http://images.51.la/'
  },
  plugins : [
    new webpack.optimize.UglifyJsPlugin()
    // qiniuPlugin
  ]
})
