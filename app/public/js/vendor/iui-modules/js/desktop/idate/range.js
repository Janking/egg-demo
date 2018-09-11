let idate = require('./index')
let dateUtils = require('../../vendor/dateUtils')
let defaults = {
  initDate : new Date(),
  minDate  : '1900-00-00',
  maxDate  : '2019-10-10',
  locales  : {
    weekName  : ['日', '一', '二', '三', '四', '五', '六'],
    monthName : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
  format      : 'YYYY-MM-DD',
  currentView : 'date',
  separate    : '~',
  type        : 'date', // week , month ,year 
  extra       : null
};

let ENP = {
  click : 'click.iui-idate-range',
  focus : 'focus.iui-idate-range'
}

function IdateRange(options, selector) {
  let _this = this
  _this.$el = $(selector)
  _this.config = $.extend({}, defaults, options)
  _this.left = new idate.defaults($.extend({}, _this.config, { maxDate: '2017-11-30' }))
  _this.right = new idate.defaults($.extend({}, _this.config, { initDate: dateUtils.modifyMonth(_this.config.initDate, 1), minDate: '2017-11-30' }))
  _this.start = null
  _this.stop = null
  _this.init()
}

IdateRange.prototype.init = function () {
  let _this = this
  _this.$rangeBox = $('<div class="idate-container-range"/>');
  _this.$rangeBox.append(_this.left.$container.removeClass('idate-hidden').addClass('idate-left'))
  _this.$rangeBox.append(_this.right.$container.removeClass('idate-hidden').addClass('idate-right'))
  $('body').append(_this.$rangeBox)
}

IdateRange.prototype.bindEvent = function () {
  let _this = this
  let $context = _this.$container
  $context.on(ENP.click, '.idate-date td:not(.disabled)', function (event) {
    event.preventDefault()

  })
}

module.exports = {
  idateRange : function (options) {
    return this.each(function (index, el) {
      $(el).data('idate', new IdateRange(options, el))
    })
  }
}
