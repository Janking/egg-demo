module.exports = {
  format(date, fmt) {

    fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
    if (typeof date === 'string') {
      date = new Date(date.replace(/-/g, '/'))
    }
    if (typeof date === 'number') {
      date = new Date(date)
    }
    var o = {
      'M+' : date.getMonth() + 1,
      'D+' : date.getDate(),
      'h+' : date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+' : date.getHours(),
      'm+' : date.getMinutes(),
      's+' : date.getSeconds(),
      'q+' : Math.floor((date.getMonth() + 3) / 3),
      'S'  : date.getMilliseconds()
    }
    var week = {
      '0' : '\u65e5',
      '1' : '\u4e00',
      '2' : '\u4e8c',
      '3' : '\u4e09',
      '4' : '\u56db',
      '5' : '\u4e94',
      '6' : '\u516d'
    }
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  },
  isEqual(src, desc) {
    return (
      src.getFullYear() === desc.getFullYear() &&
      src.getMonth() === desc.getMonth() &&
      src.getDate() === desc.getDate()
    );
  },
  isEqualMonth(src, desc) {
    return (
      src.getFullYear() === desc.getFullYear() &&
      src.getMonth() === desc.getMonth()
    );

  },
  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1)
  },
  getLastDayOfMonth(month, year) {
    return new Date(year, month + 1, 0)
  },
  getDayfromDate(date) {
    return new Date(date).getDay()
  },
  calcAllDate(month, year) {
    let firstDate = this.getFirstDayOfMonth(month, year)
    let lastDate = this.getLastDayOfMonth(month, year).getDate()
    let dayOfFirstDate = firstDate.getDay()
    let afterPadNum = 42 - dayOfFirstDate - lastDate
    let dateArr = []
    for (let i = 0; i < dayOfFirstDate; i++) {
      dateArr[dayOfFirstDate - i - 1] = new Date(year, month, -i)
    }
    for (let i = 0; i < lastDate; i++) {
      dateArr.push(new Date(year, month, i + 1))
    }

    for (let i = 0; i < afterPadNum; i++) {
      dateArr.push(new Date(year, month + 1, i + 1))
    }

    return dateArr
  },
  getRangeYear(date) {
    let currentYear = date.getFullYear()
    let digitOfCurrentYear = Number((currentYear + '').split('').reverse()[0]);
    let startYear = currentYear - digitOfCurrentYear;
    return [startYear, startYear + 11]
  },
  convert : function (d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp) 
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return (
      d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0], d[1], d[2]) :
          d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
              typeof d === "object" ? new Date(d.year, d.month, d.date) :
                NaN
    );
  },
  compare : function (a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(a = this.convert(a).valueOf()) &&
        isFinite(b = this.convert(b).valueOf()) ?
        (a > b) - (a < b) :
        NaN
    );
  },
  inRange : function (d, start, end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(d = this.convert(d).valueOf()) &&
        isFinite(start = this.convert(start).valueOf()) &&
        isFinite(end = this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
    );
  },
  modifyDate : function (date, num) {
    let initDate = new Date(date)
    return new Date(initDate.setDate(initDate.getDate() + num))
  },
  modifyMonth : function (date, num) {
    let initDate = new Date(date)
    return new Date(initDate.setMonth(initDate.getMonth() + num))
  },
  modifyYear : function (date, num) {
    let initDate = new Date(date)
    return new Date(initDate.setFullYear(initDate.getFullYear() + num))
  }

}
