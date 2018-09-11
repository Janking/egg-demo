'use strict';
module.exports = {
  url: process.env === 'production' ? 'http://localhost:8070' : 'http://192.168.0.32:8070',
  datav: {
    baseUrl: 'http://14.17.102.104:7777', // 大屏数据调用接口
  },
  datav_zz: {
    baseUrl: 'http://42.236.73.211:7777', // 大屏数据调用接口
  },
  tencent_img: {
    baseUrl: 'https://ssl.captcha.qq.com', // 腾讯接口调用
    method: 'post',
  },
  upload: {
    public: 'T-sJRpBtnzQCQjGm2ROvWOTh1vLGy6pZCC9vBJrf',
    secret: '3_7wz4LylWDn0WrG5aY9sitT1TLowdpqIq10ZWlr',
  },
  micromessage: {
    baseUrl: 'http://wx.51.la',
    // baseUrl : 'http://192.168.1.54:8012',
    method: 'post',
  },
  qqValid: {
    aid: '2069817081',
    AppSecretKey: '07hkZv7M_VdcPRaTlCRBpzQ**',
  },
};
