let dateUtils = require('../../vendor/dateUtils')
let Store = require('./store')
let Render = require('./render')
let View = require('./view')
let Event = require('./event')
let defaults = {
  initDate : new Date(),
  minDate  : '2009-10-01',
  maxDate  : '2023-10-10',
  locales  : {
    weekName  : ['日', '一', '二', '三', '四', '五', '六'],
    monthName : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
  format      : 'YYYY-MM-DD',
  currentView : 'date',
  separate    : '~',
  type        : 'date', // date , month ,year 
  extra       : null
};

/**
 * EVENT NAME SPACE
 */
let ENP = {
  click : 'click.iui-idate',
  focus : 'focus.iui-idate'
}

function Idate(options, selector) {
  let _this = this
  _this.$el = $(selector)
  _this.config = $.extend({}, defaults, options)
  _this.value = _this.$el.val() || null
  _this.text = _this.value ? dateUtils.format(_this.value, _this.config.format) : ''
  _this.currentView = _this.config.currentView
  Store.call(_this, _this.config.initDate)
  Render.call(_this, _this.config)
}

Idate.prototype = Object.create(Store.prototype)

$.extend(Idate.prototype, Render.prototype)

$.extend(Idate.prototype, View)

Idate.prototype.constructor = Idate

Idate.prototype.init = function () {
  $('body').append(this.$container)
  this.bindEvent()
}
Idate.prototype.bindEvent = function () {
  let _this = this
  let $context = _this.$container
  let config = _this.config

  _this.$container.on(ENP.click, function () {
    event.stopPropagation()
  })

  $context.on(ENP.click, '.btn-next-month', function (event) {
    event.preventDefault()
    Event.updateDateView.call(_this, _this._nM, event)
  })

  $context.on(ENP.click, '.btn-prev-month', function (event) {
    event.preventDefault()
    Event.updateDateView.call(_this, _this._pM, event)
  })

  $context.on(ENP.click, '.btn-next-year', function (event) {
    event.preventDefault()
    let currentView = _this.currentView
    if (currentView === 'year') {
      let rangeYear = dateUtils.getRangeYear(_this._d)
      let nextTenYear = new Date(new Date().setFullYear(rangeYear[0] + 10))
      Event.updateYearView.call(_this, nextTenYear, event)
    } else {
      Event[currentView === 'date' ? 'updateDateView' : 'updateMonthView'].call(_this, _this._nY, event)
    }

  })

  $context.on(ENP.click, '.btn-prev-year', function (event) {
    event.preventDefault()
    let currentView = _this.currentView
    if (currentView === 'year') {
      let rangeYear = dateUtils.getRangeYear(_this._d)
      let prevTenYear = new Date(new Date().setFullYear(rangeYear[0] - 10))
      Event.updateYearView.call(_this, prevTenYear, event)
    } else {
      Event[currentView === 'date' ? 'updateDateView' : 'updateMonthView'].call(_this, _this._pY, event)
    }

  })

  $context.on(ENP.click, '.btn-call-month', function (event) {
    event.preventDefault()
    Event.updateMonthView.call(_this, _this._d, event)
  })

  $context.on(ENP.click, '.btn-call-year', function (event) {
    event.preventDefault()
    Event.updateYearView.call(_this, _this._d, event)
  })

  $context.on(ENP.click, '.idate-year td:not(.disabled) a', $.proxy(Event.selectYear, _this))

  $context.on(ENP.click, '.idate-month td:not(.disabled) a', $.proxy(Event.selectMonth, _this))


  $context.on(ENP.click, '.btn-extra', function (event) {
    event.preventDefault()
    Event.checked.call(_this, event)
  })

  $context.on(ENP.click, '.idate-date td:not(.disabled)', function (event) {
    event.preventDefault()
    Event.checked.call(_this, event)
  })

  _this.$el.on(ENP.click, function (event) {
    _this._d = new Date(this.value).toString() === 'Invalid Date' ? _this.config.initDate : new Date(this.value);
    let mode = {
      date  : 'updateDateView',
      month : 'updateMonthView',
      year  : 'updateYearView'
    }
    Event[mode[config.type]].call(_this, _this._d, event)
    _this.show()
    return false
  });
}


$(document).on(ENP.click, function (event) {
  let $target = $(event.target)
  if ($target.closest('.idate-container').length === 0) {
    $('.idate-container').addClass('idate-hidden')
  }
})


module.exports = {
  idate : function (options) {
    return this.each(function (index, el) {
      let date = new Idate(options, el)
      date.init()
      $(el).data('idate', date)
    })
  },
  defaults : Idate
}
