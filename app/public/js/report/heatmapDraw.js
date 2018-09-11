
require('../../sass2/heatmap.scss')
require('./heatmapDatepicker')
let $ = require('jquery')
let h337 = require('../vendor/heatmap.js')
let LAUI = {}
// 注入到jQuery原型对象
$.each([
  require('../vendor/iui-modules/js/functional/ajaxForm'),
  require('../vendor/iui-modules/js/functional/validate'),
  require('../vendor/iui-modules/js/common/layer.js')
], function (index, component) {
  if (typeof component === 'object' && !LAUI[component]) {
    $.extend(LAUI, component.default)
  }
})

// 注入到jQuery全局对象
$.each([
  require('../vendor/iui-modules/js/common/alert'),
  require('../vendor/iui-modules/js/common/dialog'),
  require('../vendor/iui-modules/js/common/loading'),
  require('../vendor/iui-modules/js/functional/cookie'),
  require('../vendor/iui-modules/js/functional/pubsub'),
  require('../vendor/iui-modules/js/desktop/tooltip')
  // require('../vendor/iui-modules/js/desktop/popover'),
  // require('../vendor/iui-modules/js/desktop/inlineEditor'),
  // require('../vendor/iui-modules/js/common/slippage')
], function (index, component) {
  $.extend(component.default)
})

// 调用插件
$.fn.LAUI = function () {
  var arg = arguments
  var component = LAUI[arguments[0]]
  if (component) {
    arg = Array.prototype.slice.call(arg, 1)
    return component.apply(this, arg)
  } else {
    $.error('Method ' + arguments[0] + ' does not exist on jQuery.LAUI Plugin')
    return this
  }
}

function removeParam(name, url) {
  if (typeof name !== 'string') return false
  if (!url) url = window.location.href
  var urlparts = url.split('?')
  if (urlparts.length === 1) {
    return urlparts[0]
  }
  var prefix = encodeURIComponent(name + '=')
  var pars = urlparts[1].split(/[&;]/g)
  var i = 0
  var len = pars.length

  for (; i < len; i++) {
    if (encodeURIComponent(pars[i]).lastIndexOf(prefix, 0) !== -1) {
      pars.splice(i, 1)
    }
  }

  url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '')

  return url
}

function removeParams(nameMulti, url) {
  var result = url || ''
  var names = nameMulti.split(' ')
  var i = 0
  var len = names.length
  if (names.length === 0) return false

  for (; i < len; i++) {
    result = removeParam(names[i], result)
  }
  return result
}
function gmdate(value) {
  let hours = Math.floor(value / 3600) > 9 ? Math.floor(value / 3600) : '0' + Math.floor(value / 3600)
  value %= 3600
  let minutes = Math.floor(value / 60) > 9 ? Math.floor(value / 60) : '0' + Math.floor(value / 60)
  let seconds = value % 60 > 9 ? value % 60 : '0' + value % 60
  return hours + ':' + minutes + ':' + seconds
}

function restArgs(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex
  return function () {
    var length = Math.max(arguments.length - startIndex, 0)
    var rest = Array(length)
    var index = 0
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex]
    }
    switch (startIndex) {
      case 0: return func.call(this, rest)
      case 1: return func.call(this, arguments[0], rest)
      case 2: return func.call(this, arguments[0], arguments[1], rest)
    }
    var args = Array(startIndex + 1)
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index]
    }
    args[startIndex] = rest
    return func.apply(this, args)
  }
}

function debounce(func, wait, immediate) {
  var timeout, result

  var later = function (context, args) {
    timeout = null
    if (args) result = func.apply(context, args)
  }

  var debounced = restArgs(function (args) {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(later, wait)
      if (callNow) result = func.apply(this, args)
    } else {
      timeout = restArgs(function (func, wait, args) {
        return setTimeout(function () {
          return func.apply(null, args)
        }, wait)
      })(later, wait, this, args)
    }

    return result
  })

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

let clickDataMap = {}

$('<link/>', {
  rel  : 'stylesheet',
  type : 'text/css',
  href : `//${localStorage.getItem('51la_host')}/dist/heatmap-style.css`
}).appendTo('body')

$('body').append(`
<div class="la-heatmap-toolbar-pin"><i class="la-iconfont icon-turnon"></i></div>
<div class="la-heatmap-toolbar clearfix">
  <form class="la-heatmap-form" action="//${localStorage.getItem('51la_host')}/api/heatmap" method="POST">
    <input type="hidden" name="token" value="${localStorage.getItem('51la_token')}">
    <input type="hidden" name="currentUrl" value="${removeParams('51la_heatmap 51la_referrer', window.location.href)}">
    <input type="hidden" name="start">
    <input type="hidden" name="stop">
    <div class="la-pull-left pl20"><i class="la-iconfont icon-LOGO"></i></div>
    <div class="la-pull-right">
      <div class="la-toolbar-item">
        <div class="la-btn-switch">
          <a href="javascript:;" class="la-btn-switch-item active" data-type="1">热力</a>
          <a href="javascript:;" class="la-btn-switch-item" data-type="0">事件</a>
        </div>
      </div>
      <div class="la-toolbar-item">
        <a href="javascript:;" class="la-toolbar-refresh"><i class="la-iconfont icon-refresh"></i>&nbsp;刷新</a>
      </div>
      <div class="la-toolbar-item">
        <a href="javascript:;" class="la-toolbar-toggle"><i class="la-iconfont icon-turnoff"></i>&nbsp;隐藏</a>
      </div>
    </div>
    <div class="la-pull-right la-responsed">
      <div class="la-toolbar-item">
        <div class="la-heatmap-info">详情</div>
      </div>
      <div class="la-toolbar-item">
      <input type="text" data-range="true" readonly class="la-heatmap-date" placeholder="时间范围">
      </div>
    </div>
  </form>
</div>`)

let $toolbarForm = $('.la-heatmap-form')
let DATA = null

$toolbarForm.LAUI('ajaxForm', {
  before : function () {
    $('[name="currentUrl"]').val(removeParams('51la_heatmap 51la_referrer', window.location.href))

    $.loading(true, true)

    if ($toolbarForm.serialize() === $toolbarForm.data('serialize')) {
      clearTimeout($toolbarForm.data('cacheTimer'))
      $toolbarForm.data('cacheTimer', setTimeout(function () {
        $.loading(false)
        clickDataMap = {}
        success(DATA)
      }, 1000))
      return false
    }
    $toolbarForm.data('serialize', $toolbarForm.serialize())
  },
  success : function (res) {
    $.loading(false)
    DATA = res
    success(res)
  },
  error : function (res) {
    $.loading(false)
  }
})

function success(res) {
  if (!res || !res.data) {
    return false
  }

  updateInfo(res)

  $datepicker.val(res.start + ' to ' + res.stop)

  if ($('.la-btn-switch-item.active').data('type')) {
    heatmapDraw(res.data)
    readDepthDraw(res.readDepth)
  } else {
    updateClicks(res.clicks)
  }
}

function updateInfo(resources) {
  let info = `<thead><tr><th>屏数</th><th>PV</th><th>UV</th><th>IP</th><th>退出次数</th><th>退出率</th><th>平均停留时长</th></tr></thead>`
  if (resources.readDepth) {
    $.each(resources.readDepth, function (index, item) {
      info += `<tr>
      <td>第${item.readDepth}屏</td>
      <td>${item.pv}</td>
      <td>${item.uv}</td>
      <td>${item.ip}</td>
      <td>${item.leavePv}</td>
      <td>${(item.leavePv / item.pv * 100).toFixed(2)}%</td>
      <td>${gmdate(parseInt(item.duration / item.pv))}</td>
      </tr>`
    })
  } else {
    info += `<tr>
    <td> - </td>
    <td> - </td>
    <td> - </td>
    <td> - </td>
    <td> - </td>
    <td> - </td>
    <td> - </td>
    </tr>`
  }

  let amouont = `<table class="c-table c-table-hover"><thead><tr><th>总点击次数</th><th>元素最大点击次数</th><th>PV</th></tr></thead><tbody><tr><td>${resources.clicks.allClickTimes || 0}</td><td>${resources.clicks.maxClickTimes || 0}</td><td>${resources.clicks.pv || 0}</td></tr></tbody></table>`

  let $infoLayer = $('#layer-info').LAUI('layer', {
    content     : `<div class="layer-header clearfix"><div class="pull-left"><div class="layer-title">页面详情</div></div><div class="pull-right"><a href="javascript:;" class="btn-close la-icon-close"></a></div></div>${amouont}<br><br><table class="c-table c-table-hover">${info}</table>`,
    offsetWidth : 800,
    dynamic     : true
  })

  $('.la-heatmap-info').off('click').on('click', function () {
    $infoLayer.showLayer()
  })
}

let $datepicker = $('.la-heatmap-date').datepicker({
  toggleSelected         : false,
  range                  : true,
  dateFormat             : 'yyyy-mm-dd',
  multipleDatesSeparator : ' to ',
  onSelect               : function (value, dateArr) {
    if (dateArr.length === 2) {
      $('[name="start"]').val(value.split(' to ')[0])
      $('[name="stop"]').val(value.split(' to ')[1])
      $toolbarForm.trigger('submit')
    }
  }
})

$datepicker.data('datepicker')

$.tooltip({ container: '.la-heatmap-toolbar', handler: '.la-heatmap-info' })

$('.la-btn-switch').on('click', 'a', function () {
  $(this).addClass('active').siblings('.active').removeClass('active')

  if ($(this).hasClass('active') && $(this).data('type') === 0) {
    $('body').addClass('la-event-starting')
    $('body').on(clickEvent, '*')
    updateClicks(DATA.clicks)

    // 关闭热力
    $('.heatmap-canvas').fadeOut(300)
    $('.la-page-line').hide(300)
  } else {
    $('body').removeClass('la-event-starting')
    $('body').off(clickEvent, '*')

    // 开启热力
    $('.heatmap-canvas').fadeIn(300)
    $('.la-page-line').show(300)
    $('body').off('mousemove mouseouter')
  }
})

$('.la-toolbar-refresh').on('click', function (event) {
  $('.la-heatmap-form').trigger('submit')
})

$('.la-toolbar-toggle').on('click', function () {
  $('.la-heatmap-toolbar').addClass('la-toolbar-active')
  $('.la-heatmap-toolbar-pin').addClass('la-toolbar-active')
})

$('.la-heatmap-toolbar-pin').on('click', function () {
  $('.la-heatmap-toolbar').removeClass('la-toolbar-active')
  $('.la-heatmap-toolbar-pin').removeClass('la-toolbar-active')
})

let $lineL = $('<div class="la-event-backdrop-left">').appendTo('body')
let $lineR = $('<div class="la-event-backdrop-right">').appendTo('body')
let $lineT = $('<div class="la-event-backdrop-top">').appendTo('body')
let $lineB = $('<div class="la-event-backdrop-bottom">').appendTo('body')
let clickEvent = {
  mouseenter(event) {
    if (!/^(la-|^heatmap-|^datepicker-)/.test(event.target.className)) {
      let pos = event.target.getBoundingClientRect()
      $lineL.css({ display: 'block', left: pos.left, height: pos.height, top: pos.top + $(document).scrollTop() })
      $lineR.css({ display: 'block', left: pos.left + pos.width, height: pos.height, top: pos.top + $(document).scrollTop() })
      $lineT.css({ display: 'block', left: pos.left, width: pos.width, top: pos.top + $(document).scrollTop() })
      $lineB.css({ display: 'block', left: pos.left, width: pos.width, top: pos.top + pos.height + $(document).scrollTop() - 2 })
      let index = $(event.target.nodeName).index(event.target)
      let data = clickDataMap[event.target.nodeName] && clickDataMap[event.target.nodeName][index] ? clickDataMap[event.target.nodeName][index] : {}
      $.alert({
        text    : `点击次数：${data.clickTimes || 0}，点击率：${((data.rate || 0) * 100).toFixed(2)} % `,
        timeout : 3000
      })
    }
  },
  mouseleave() {
    $lineL.hide()
    $lineR.hide()
    $lineT.hide()
    $lineB.hide()
  }
}

function detectmob() {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true
  } else {
    return false
  }
}

function heatmapDraw(data) {
  if ($('.heatmap-canvas').length) {
    $('.heatmap-canvas').remove()
  }

  let config = {
    container       : document.body,
    backgroundColor : 'rgba(0,0,0,.35)',
    radius          : 20,
    maxOpacity      : 1,
    blur            : 0.75,
    width           : window.innerWidth,
    height          : document.body.scrollHeight
  }

  let heatmapInstance = h337.create(config)

  // 数据为空则停止执行
  if (!data || data.length === 0) {
    return false
  }

  // 热力图中的api apply方法能劫持另外一个对象的方法，继承另外一个对象的属性
  // heatmapInstance.setDataMin(0)
  // 处理数据
  var heatmapDataList = []
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

  $.each(data.clicks, function (index, value) {
    var pl = value.pp.split(',')[0]
    var pt = value.pp.split(',')[0]
    var elTag = value.id.replace('_tidx_', '').split(';')
    var $el = $(elTag[0].toLowerCase()).eq(elTag[1])
    if ($el.length && $el.is(':visible')) {
      var offset = $el[0].getBoundingClientRect()
      var x = offset.left + (offset.width * pl) + scrollLeft
      var y = offset.top + (offset.height * pt) + scrollTop
      var point = {
        x     : parseInt(x),
        y     : parseInt(y),
        value : value.clickTimes
      }
      heatmapDataList.push(point)
    }
  })

  heatmapInstance.setData({ max: data.maxClickTimes, data: heatmapDataList })

  if ($('.la-heatmap-tooltip').length === 0) {
    $('body').append('<div class="la-heatmap-tooltip"></div>')
  }

  let demoWrapper = document.querySelector('.heatmap-canvas')
  let tooltip = document.querySelector('.la-heatmap-tooltip')

  function updateTooltip(x, y, value) {
    var transl = 'translate(' + (x + 15) + 'px, ' + (y + 15) + 'px)'
    tooltip.style.webkitTransform = transl
    tooltip.innerHTML = '热值 ≈ ' + value
  }

  $(demoWrapper).off('mouseenter')
  $(demoWrapper).off('mouseleave')

  $(demoWrapper).on({
    mousemove(ev) {
      var x = ev.pageX
      var y = ev.pageY
      // getValueAt gives us the value for a point p(x/y)
      var value = heatmapInstance.getValueAt({
        x : x,
        y : y
      })
      tooltip.style.display = 'block'
      updateTooltip(x, y, value)
    },
    mouseout() {
      tooltip.style.display = 'none'
    }
  })
}

// 点击事件处理
function updateClicks(data) {
  // 数据为空则停止执行
  if (!data || data.length === 0) {
    return false
  }
  clickDataMap = {}
  $.each(data.clicks, function (index, value) {
    var elTag = value.id.replace('_tidx_', '').split(';')
    var $el = $(elTag[0].toLowerCase()).eq(elTag[1])
    if ($el.length) {
      if (!clickDataMap[elTag[0]]) {
        clickDataMap[elTag[0]] = []
      }

      if (clickDataMap[elTag[0]][elTag[1]]) {
        clickDataMap[elTag[0]][elTag[1]].clickTimes += value.clickTimes
        clickDataMap[elTag[0]][elTag[1]].rate = (clickDataMap[elTag[0]][elTag[1]].rate * 1000 + value.rate * 1000) / 1000
      } else {
        clickDataMap[elTag[0]][elTag[1]] = { clickTimes: value.clickTimes, rate: value.rate }
      }
    }
  })
}

function readDepthDraw(data) {
  if (!data) return
  $('.la-page-line').remove()
  let body = document.body
  let html = document.documentElement

  let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

  for (let i = 0, len = Math.ceil(height / 500); i < len; i++) {
    let step = (i + 1) * 500
    let top
    let isLast = false
    if (step < height) {
      top = step
    } else {
      top = step + (height - step)
      isLast = true
    }

    $('body').append(`<div class= "la-page-line" style="top:${top}px">
      <div class="la-page-line-text" data-tooltip-options="${isLast ? 'up' : 'right'}|small" data-tooltip="此屏暂无数据">&nbsp;第${i + 1}屏</div ></div>`)
  }
  // <td></td>
  for (let i = 0; i < data.length; i++) {
    $('.la-page-line-text').eq(data[i].readDepth - 1).attr('data-tooltip', `退出次数：${data[i].leavePv}<br>退出率：${(data[i].leavePv / data[i].pv * 100).toFixed(2)}%<br>PV：${data[i].pv}<br>UV：${data[i].uv}<br>IP：${data[i].pv}<br>平均停留：${gmdate(parseInt(data[i].duration / data[i].pv))}`)
  }
  $.tooltip({ container: 'body', handler: '.la-page-line-text' })
}

$(window).on('load', function () {
  $('.la-heatmap-form').trigger('submit')
})

if (!detectmob) {
  $(window).on('resize', debounce(function () {
    $('.la-heatmap-form').trigger('submit')
  }, 100))
}
