let dateUtils = require('../../vendor/dateUtils')
module.exports = Store

function Store(date) {
  let _this = this;
  _this.defaults = {
    // 今天
    _d  : new Date(date || new Date()),
    // 明天
    _nd : dateUtils.modifyDate(_this._d, 1),
    // 下个月
    _nM : dateUtils.modifyMonth(_this._nd, 1),
    // 明年
    _nY : dateUtils.modifyYear(_this._nd, 1),
    // 昨天
    _pd : dateUtils.modifyDate(_this._d, -1),
    // 上个月
    _pM : dateUtils.modifyMonth(_this._pd, -1),
    // 上一年
    _pY : dateUtils.modifyYear(_this._pd, -1)
  }
  _this.update(date)
}

Store.prototype.update = function (date) {
  let _this = this
  _this._d = new Date(date);
  _this._nd = dateUtils.modifyDate(_this._d, 1);
  _this._nM = dateUtils.modifyMonth(_this._nd, 1);
  _this._nY = dateUtils.modifyYear(_this._nd, 1);
  _this._pd = dateUtils.modifyDate(_this._d, -1);
  _this._pM = dateUtils.modifyMonth(_this._pd, -1);
  _this._pY = dateUtils.modifyYear(_this._pd, -1);
}
