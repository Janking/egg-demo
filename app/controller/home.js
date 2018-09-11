'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  async login() {
    await this.ctx.render('user/login.html', { title: '登录' });
  }
}

module.exports = HomeController;
