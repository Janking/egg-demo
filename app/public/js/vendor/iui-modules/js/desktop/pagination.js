/**
 * pageSize : 当前显示条数
 * total : 总计数值
 *
 */

var tplPagesize = '每页<input type="text" class="pagesize" role="text" maxlength="2"  value="{{pageSize}}" >'

var tplGoto = '跳转至<input type="text" class="goto"  role="text" maxlength="2" data-maxpage="{{maxpage}}">'

var template = '<div class="pagination-wrap clearfix">共{{total}}条&nbsp;&nbsp;{{size}}{{goto}}<ul class="pagination">{{queue}}</ul></div>'

function URLToArray(url) {
  var request = {}
  var pairs = url.substring(url.indexOf('?') + 1).split('&')
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=')
    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
  }
  return request
}

function ArrayToURL(array) {
  var pairs = []
  for (var key in array) { if (array.hasOwnProperty(key)) pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(array[key])) }
  return pairs.join('&')
}

function createPrevButton(data) {
  return '<li class="prev ' + (data.curPage === 1 ? 'disabled' : '') + '"><a href="javascript:;">«</a></li>'
}

function createNextButton(data) {
  return '<li class="next ' + (data.pageCount === 0 || data.curPage === data.pageCount ? 'disabled' : '') + '"><a href="javascript:;">»</a></li>'
}

var defaults = {
  url   : './demo.json',
  param : {
    curPage  : 1,
    pageSize : 20
  },
  type     : 'POST',
  maxQueue : 5,
  goTo     : true,
  pageSize : true,
  cache    : false, // 是否开启缓存
  static   : false,
  click    : function (pagination) {
    var $this = $(this)
    var _this = pagination
    var response = _this.response
    var paramsArr = URLToArray(_this.config.param)

    if ($this.hasClass('prev')) {
      paramsArr.curPage = response.curPage - 1
      $('[name="curPage"]').val(paramsArr.curPage)
    } else if ($this.hasClass('next')) {
      paramsArr.curPage = response.curPage + 1
      $('[name="curPage"]').val(paramsArr.curPage)
    } else if ($this.hasClass('pagesize')) {
      $('[name="pageSize"]').val(this.value)
      paramsArr.pageSize = this.value
    } else if ($this.hasClass('goto')) {
      var pageCount = this.value
      if (parseInt(pageCount) > response.pageCount) {
        pageCount = response.pageCount
      }
      $('[name="curPage"]').val(pageCount)
      paramsArr.curPage = pageCount
    } else {
      paramsArr.curPage = $this.data('page')
      $('[name="curPage"]').val(paramsArr.curPage)
    }
    return ArrayToURL(paramsArr)
  }

}

function Pagination(config, selector) {
  this.staticData = []
  this.config = $.extend({}, defaults, config)
  this.$selector = selector
  this.response = null
  this._cache = {}
  this._sortInitData = null
  this.init()
}

Pagination.prototype.init = function () {
  var _this = this

  this.$selector.on('click', '.prev', function () {
    if ($(this).hasClass('disabled')) {
      return false
    }
    _this.trigger(this)
    return false
  })

  this.$selector.on('click', '.next', function () {
    if ($(this).hasClass('disabled')) {
      return false
    }
    _this.trigger(this)
    return false
  })

  this.$selector.on('click', 'li[data-page]', function (event) {
    event.preventDefault()
    if ($(this).hasClass('active')) {
      return false
    }
    _this.trigger(this)
    return false
  })

  this.$selector.on('keyup', '.pagesize,.goto', function (event) {
    if (event.keyCode === 13) {
      _this.trigger(this)
    }
  })
}

Pagination.prototype.trigger = function (emitter) {
  var _this = this
  var params = _this.config.click.call(emitter, _this)

  if (!_this.config.static) {
    _this.get(params)
  } else {
    _this.getStatic(params, _this.staticData)
  }
}

Pagination.prototype.get = function (param, refresh) {
  var _this = this
  var config = _this.config
  var data = param ? (config.param = param) : config.param

  if (config.cache && _this._cache[param] && !refresh) {
    _this.$selector.trigger('get.success', [_this._cache[param], _this])
    return false
  }

  $.ajax({
    url      : config.url,
    type     : config.type,
    dataType : 'json',
    data     : data
  }).then(function (res) {
    if (config.cache) {
      _this._cache[param] = res
    }
    _this.$selector.trigger('get.success', [res, _this])
  }, function (err) {
    _this.$selector.trigger('get.error', [err, _this])
  })
}

Pagination.prototype.render = function (response) {
  var tpl = template
  var data = this.response = response
  var config = this.config

  tpl = tpl.replace('{{size}}', config.pageSize ? tplPagesize : '').replace('{{goto}}', config.goTo ? tplGoto : '')

  $.each(data, function (name, value) {
    var reg = new RegExp('\{\{' + name + '\}\}', 'gmi')
    tpl = tpl.replace(reg, value)
  })

  var queueItem = ''

  // 上一页
  var queuePrev = createPrevButton(data)

  // 下一页
  var queueNext = createNextButton(data)

  // 计算队列长度
  var queueLength = data.pageCount > config.maxQueue ? config.maxQueue : data.pageCount

  var step = Math.ceil(config.maxQueue / 2)

  var i = 1

  // 修正当前页的位置，保持在中间
  if (data.pageCount > config.maxQueue && data.curPage > step) {
    // 坑爹，必须要有括号，如果 step <= 0 会有错误
    i = data.curPage - (step - 1)
    queueLength = data.curPage + step > data.pageCount ? data.pageCount : data.curPage + step - 1

    // 当页数接近末尾，且小于默认尺寸
    if (queueLength - (i - 1) < config.maxQueue) {
      i = data.pageCount - (config.maxQueue - 1)
    }
  }

  for (; i <= queueLength; i++) {
    queueItem += '<li ' + (data.curPage === i ? 'class="active"' : '') + ' data-page="' + i + '"><a href="javascript:;">' + i + '</a></li>'
  }

  tpl = tpl.replace('{{queue}}', queuePrev + queueItem + queueNext)

  this.$selector.html(tpl)
}

module.exports = {
  pagination : function (config) {
    return new Pagination(config, this)
  }
}
