'use strict';
const path = require('path');
const fs = require('fs');
const staticConfig = require('./static.config');
module.exports = appInfo => {
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1535512140536_5392';
  // add your config here
  // 静态资源配置
  config.static = { prefix: '', dir: path.join(appInfo.baseDir, 'app/public') };
  // favico配置
  config.siteFile = { '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/favicon.ico')) };
  // session配置
  exports.session = { key: '51la.ss', maxAge: 24 * 3600 * 1000, httpOnly: true, encrypt: true };
  // redis配置
  config.redis = { client: { port: 6379, host: '127.0.0.1', password: '', db: 0 } };
  // 模板引擎配置
  config.view = { defaultViewEngine: 'nunjucks', mapping: { '.html': 'nunjucks' } };
  // 接口配置
  config.bkapi = staticConfig;
  config.httpclient = {
    request: {
      method: 'POST',
      dataType: 'json',
      timeout: 90000,
    },
    httpAgent: {
      timeout: 90000,
    },
  };
  // 权限判定配置
  config.userAuthorize = { match: '/user' };
  config.reportNavMap = { match: '/report' };

  return config;
};
