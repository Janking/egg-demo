let dateUtils = require('../../vendor/dateUtils')

module.exports = Render

function Render() {
  this.$container = $('<div class="idate-container idate-hidden"/>');
  this.renderInit();
}

Render.prototype.renderInit = function () {
  // 初始化头部
  this.initHeader();
  // 渲染星期
  this.renderWeek();
  // 初始化日期
  this.initDate();
  // 初始化月
  this.initMonth();
  // 初始化年
  this.initYear();

  if (this.config.extra) {
    this.initExtra();
  }
  return this.$container
}

Render.prototype.initHeader = function () {
  this.$headerView = $('<div class="idate-header"/>');
  this.$container.append(this.$headerView);
  this.renderHeader();
}

Render.prototype.renderHeader = function () {
  let _this = this
  let config = _this.config
  let currentView = this.currentView;
  let getRangeYear = dateUtils.getRangeYear(this._d);
  let strCenter = {
    date : `<a href="javascript:;" class="btn-call-year">${this._d.getFullYear()} 年</a>&nbsp;&nbsp;
            <a href="javascript:;" class="btn-call-month">${this._d.getMonth() + 1} 月</a>`,
    month : `<a href="javascript:;" class="btn-call-year">${this._d.getFullYear()} 年</a>`,
    year  : `<a href="javascript:;">${getRangeYear[0]}年 ~ ${getRangeYear[1]}年</a>`
  }
  let prevYear = `<a href="javascript:;" class="btn-prev-year"></a>`
  let prevMonth = `<a href="javascript:;" class="btn-prev-month"></a>`
  let nextYear = ` <a href="javascript:;" class="btn-next-year"></a>`
  let nextMonth = `<a href="javascript:;" class="btn-next-month"></a>`
  let minDate = new Date(config.minDate)
  let maxDate = new Date(config.maxDate)

  if (currentView === 'date') {
    let _pM = dateUtils.getLastDayOfMonth(_this._pM.getMonth(), _this._pM.getFullYear())
    let _nM = dateUtils.getFirstDayOfMonth(_this._nM.getMonth(), _this._nM.getFullYear())
    prevMonth = dateUtils.compare(_pM, minDate) === -1 ? '' : prevMonth
    prevYear = _this._pY.getFullYear() < minDate.getFullYear() ? '' : prevYear
    nextMonth = dateUtils.compare(_nM, maxDate) === 1 ? '' : nextMonth
    nextYear = _this._nY.getFullYear() > maxDate.getFullYear() ? '' : nextYear
  }

  if (currentView === 'month') {
    prevMonth = ''
    nextMonth = ''
    prevYear = _this._pY.getFullYear() < minDate.getFullYear() ? '' : prevYear
    nextYear = _this._nY.getFullYear() > maxDate.getFullYear() ? '' : nextYear
  }


  if (currentView === 'year') {
    let yearRange = dateUtils.getRangeYear(_this._d)
    let _pY = new Date(new Date().setFullYear(yearRange[0] - 1))
    let _nY = new Date(new Date().setFullYear(yearRange[1] + 1))
    prevMonth = ''
    nextMonth = ''
    prevYear = _pY.getFullYear() < minDate.getFullYear() ? '' : prevYear
    nextYear = _nY.getFullYear() > maxDate.getFullYear() ? '' : nextYear
  }

  let templateHeader = `
    <div class="idate-header-left">${prevYear}${prevMonth}</div>
    <div class="idate-header-right">${nextMonth}${nextYear}</div>
    <div class="idate-header-center">${strCenter[currentView]}</div>`;


  this.$headerView.html(templateHeader);
  this.$prevYear = this.$container.find('.btn-prev-year');
  this.$nextYear = this.$container.find('.btn-next-year');
  this.$prevMonth = this.$container.find('.btn-prev-month');
  this.$nextMonth = this.$container.find('.btn-next-month');
}

Render.prototype.renderWeek = function () {
  let str = ''
  this.$week = $('<div class="idate-week"/>');
  $.each(this.config.locales.weekName, function (index, value) {
    str += '<td data-id="' + index + '">' + value + '</td>'
  })
  this.$week.html(`<table><tbody>${str}</tbody></table>`)
  this.$container.append(this.$week)
}

Render.prototype.initDate = function () {
  this.$dateView = $('<div class="idate-date"/>');
  this.$container.append(this.$dateView);
  this.renderDate(this.config.initDate);
}

Render.prototype.renderDate = function (date) {
  let _this = this;
  let _date = date;
  let month = _date.getMonth();
  let year = _date.getFullYear();
  let dates = dateUtils.calcAllDate(month, year);
  let str = '';
  let minDate = new Date(_this.config.minDate);
  let maxDate = new Date(_this.config.maxDate);

  $.each(dates, function (index, dateItem) {
    let isCurrentDate = dateUtils.isEqual(new Date(), dateItem) ? ' current-date' : '';
    let disabledDate = dateUtils.compare(dateItem, minDate) === -1 || dateUtils.compare(dateItem, maxDate) === 1 ? ' disabled' : '';
    let whichMonth = dateItem.getMonth() > month ? 'next-month' : dateItem.getMonth() < month ? 'prev-month' : 'current-month';
    let checked = !disabledDate && dateUtils.isEqual(new Date(_this.value), dateItem) ? ' checked' : '';
    if (index % 7 === 0) {
      str += '<tr>'
    }
    str += `<td class="${whichMonth}${isCurrentDate}${disabledDate}${checked}" title="${dateUtils.format(dateItem, _this.config.format)}">${dateItem.getDate()}</td>`
    if (index % 7 === 6) {
      str += '</tr>'
    }
  })

  this.$dateView.html(`<table><tbody>${str}</tbody></table>`);
}

Render.prototype.initMonth = function () {
  this.$monthView = $('<div class="idate-month idate-hidden"/>');
  this.$container.append(this.$monthView)
  this.renderMonth()
}

Render.prototype.renderMonth = function (date) {
  let _this = this;
  let str = '';
  let _date = date || _this._d;
  let monthName = _this.config.locales.monthName;
  let minDate = new Date(_this.config.minDate);
  let maxDate = new Date(_this.config.maxDate);
  let value = new Date(_this.value)
  for (let i = 0; i < 12; i++) {
    let thisDate = new Date(_date.setMonth(i));
    let currentDate = dateUtils.format(thisDate, _this.config.format);
    let disabledDate = dateUtils.compare(thisDate, minDate) === -1 || dateUtils.compare(thisDate, maxDate) === 1 ? 'disabled' : '';
    let checked = new Date(value).getMonth() === i && new Date(value).getFullYear() === _date.getFullYear() ? 'checked' : '';
    if (i % 4 === 0) {
      str += '<tr>'
    }
    str += `<td class="${disabledDate} ${checked}"><a href="javascript:;" title="${currentDate}">${monthName[i]}</a></td>`
    if (i % 4 === 3) {
      str += '</tr>'
    }
  }
  this.$monthView.html(`<table><tbody>${str}</tbody></table>`);
}

Render.prototype.initYear = function () {
  this.$yearView = $('<div class="idate-year idate-hidden"/>');
  this.$container.append(this.$yearView)
  this.renderYear()
}

Render.prototype.renderYear = function (date) {
  let _this = this;
  let str = '';
  let _date = date || _this._d;
  let currentYear = _date.getFullYear()
  let digitOfCurrentYear = Number((currentYear + '').split('').reverse()[0]);
  let startYear = currentYear - digitOfCurrentYear;
  let minDate = new Date(_this.config.minDate);
  let maxDate = new Date(_this.config.maxDate);
  for (let i = 0; i < 12; i++) {
    let year = startYear + i
    let thisYear = new Date(new Date().setFullYear(year))
    let isCurrentYear = new Date().getFullYear() === year ? 'current-year' : ''
    let disabledDate = dateUtils.compare(thisYear, minDate) === -1 || dateUtils.compare(thisYear, maxDate) === 1 ? 'disabled' : '';
    let currentYear = dateUtils.format(thisYear, _this.config.format);
    if (i % 4 === 0) {
      str += '<tr>'
    }
    str += `<td class="${isCurrentYear} ${disabledDate}"><a href="javascript:;" title="${currentYear}">${year}</a></td>`
    if (i % 4 === 3) {
      str += '</tr>'
    }
  }
  this.$yearView.html(`<table><tbody>${str}</tbody></table>`);

}

Render.prototype.initExtra = function () {
  this.$extra = $('<div class="idate-extra"/>');
  this.$container.append(this.$extra)
  this.renderExtra()
}

Render.prototype.renderExtra = function () {
  let str = ''
  let _this = this
  let config = _this.config
  $.each(config.extra, function (index, item) {
    str += `<a href="javascript:;" class="btn-extra" title="${dateUtils.format(item, config.format)}">${index}</a>`
  });
  this.$extra.html(str)
}
