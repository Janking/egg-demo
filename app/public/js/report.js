// 全局引入样式
// require('../sass/report.scss')
require('../sass2/report2.scss')
var inject = require('./vendor/iui/inject')
// 注入layer组件
inject(require('./vendor/iui/common/layer'), true)
// 注入validate组件
inject(require('./vendor/iui/functional/validate'), true)
inject(require('./vendor/iui/functional/ajaxForm'), true)
inject(require('./vendor/iui/desktop/placeholder'), true)
inject(require('./vendor/iui/desktop/pagination'), true)
inject(require('./vendor/iui/desktop/tooltip'), false)
inject(require('./vendor/iui/common/alert'), false)
inject(require('./vendor/iui/common/dialog'), false)
inject(require('./vendor/iui/common/loading'), false)
inject(require('./vendor/iui/desktop/dropdown'), true)
inject(require('./vendor/iui/common/tabs'), true)
inject(require('./vendor/iui/functional/pubsub'), false)
inject(require('./vendor/iui/functional/paramter'), false)
inject(require('./vendor/iui/functional/cookie'), false)
inject(require('./vendor/iui/desktop/cascader'), true)
inject(require('./vendor/iui/desktop/tableHeaderFix'), true)

$('.inject-date').on('click', 'a', function (event) {
  $('.input-datepicker').val($(this).attr('data-time'))
  $('#form-lifting').submit()
})

require('./module/login')()

$('.username').on('click', function (event) {
  event.stopPropagation()
  $('.userexit').css('display', 'block')
})

$(document).on('click', function () {
  $('.userexit').css('display', 'none')
})

let navStatus = {}
try {
  navStatus = JSON.parse(decodeURIComponent($.cookie.get('51report_nav_level')))
} catch (e) {
  navStatus = {}
}
// 导航
$('.nav-item-1-title').closest('li').on({
  click: function (event) {
    if (!$('body').hasClass('sidebar-shrink')) {
      var $title = $(this).find('.nav-item-1-title')
      if (event.target.nodeName !== 'A') {
        if ($title.hasClass('active')) {
          $title.removeClass('active')
          $(this).find('.nav-level-2').slideUp(300)
          navStatus[$title.attr('role')] = 0
        } else {
          $title.addClass('active')
          $(this).find('.nav-level-2').slideDown(300)
          navStatus[$title.attr('role')] = 1
        }

        $('.nav-item-1-title').removeClass('has-child-active')
        $title.addClass('has-child-active')
      }
      $.cookie.set('51report_nav_level', navStatus)
    }
  }
})

$('.btn-nav-toggle-1').on('click', function (event) {
  event.preventDefault()
  $('body').addClass('sidebar-shrink')
  $.cookie.set('51report_nav', 1)
})

$('.btn-nav-toggle-2').on('click', function (event) {
  event.preventDefault()
  $('body').removeClass('sidebar-shrink')
  $.cookie.set('51report_nav', 0)
})

// 下拉
{
  let _data = []
  if (ROLE === 'admin') {
    $.post('/user/site/list/dropdown', {
      _csrf: $('[name="_csrf"]').val()
    }, function (res) {
      if (res.code === 401) {

      } else {
        let OWNER_SITES = JSON.parse(res)
        $.each(OWNER_SITES, function (index, value) {
          var isCurrent = value.comId === parseInt(COMID)
          _data.push({
            disabled: false,
            id: value.comId,
            name: value.name,
            selected: isCurrent
          })
        })
        $('.select-site').IUI('dropdown', {
          input: '<input type+"text" maxLength="20" id="select-site-input" placeholder="网站名称或统计ID">',
          data: _data,
          choice: function (event) {
            var $target = $(event.target)
            var comId = $target.data('value')
            // var reg = new RegExp(+"", "i")
            var thislocation = window.location.href
            window.location.href = thislocation.replace(/comId=([^&]*)(&|$)/, 'comId=' + comId + '$2')
          }
        })
      }
    })
  }

  // $('.select-site').IUI('dropdown', {
  //   input: '<input type+"text" maxLength="20" placeholder="网站名称或统计ID">',
  //   data: _data,
  //   searchable: false
  // })
  // $('.select-site').on('click', function () {
  //   $(this).removeClass('active')
  // })
}

require('./module/returnTop')()
// 广告点击统计
require('./module/adClick')()
/**
 * 滚动隐藏广告
 */
var $backTop = $('.backTop')
$('.main-nested').scroll(function () {
  if ($(this).scrollTop() > 500) {
    $backTop.show()
  } else {
    $backTop.hide()
  }
  if ($(this).scrollTop() > 0) {
    $('.box-da-top').hide(200)
  } else {
    $('.box-da-top').show(200)
  }
})
/**
 * 下载页面删除任务
 */

$('body').on('click', '.remove-download', function (event) {
  var $this = $(this)
  $.dialog({
    content: '<div class="fb f20 c33 tc">确定要删除当前任务吗？</div>',
    type: 'confirm',
    closeBtn: true,
    confirm: function (deferred) {
      $.get($this.attr('data-url')).then(function (res) {
        if (res.flag) {
          $.alert({
            text: '删除成功！'
          })
        } else {
          $.alert({
            text: '删除失败，请重试！'
          })
        }
      })
      deferred.hideDialog()

      window.location.href = '/report/download/list?comId=' + COMID
    }
  })
})

/**
 * 退出登录弹层
 */
// $('body').on('click', '.user-logout,.nav-logout', function (event) {
//   event.preventDefault()
//   $.dialog({
//     content: '<div class="fb f20 c33 tc">' + role + '</div>',
//     type: 'confirm',
//     closeBtn: true,
//     confirm: function (deferred) {
//       $.get(url).then(function (res) {
//         window.location.href = window.location.href
//       })
//       deferred.hideDialog()
//     }
//   })
// })

/**
 * 点击时间icon也能弹出
 */
$('body').find('.icon-rili').on('click', function () {
  $(this).prev().focus()
})

/**
 * 侧边栏的
 */
// if ($('.nav-item-2.active').length) {
//   $('.navigator').animate({
//     scrollTop : $('.nav-item-2.active').offset().top - 45
//   }, 300)
// }

$('.nav-item-2').each(function (idex, el) {
  var $el = $(el)
  var name = $.trim($el.text())
  var isRange = name !== '时段分析'
  var link = isRange ? $el.attr('href') : `/report/flow/his_detail?comId=${COMID}`
  var time = TIME
  var todayLink = $.urlHelper.setParams((isRange ? {
    start: time.today,
    stop: time.today
  } : {
      // date : time.today
      start: time.today + ' 00:00:00',
      stop: time.today + ' 23:59:59'
    }), link)
  var yesterday = $.urlHelper.setParams((isRange ? {
    start: time.yesterday,
    stop: time.yesterday
  } : {
      // date : time.yesterday
      start: time.yesterday + ' 00:00:00',
      stop: time.yesterday + ' 23:59:59'
    }), link)
  var theDayBeforeYesterday = $.urlHelper.setParams((isRange ? {
    start: time.theDayBeforeYesterday,
    stop: time.theDayBeforeYesterday
  } : {
      // date : time.theDayBeforeYesterday
      start: time.theDayBeforeYesterday + ' 00:00:00',
      stop: time.theDayBeforeYesterday + ' 23:59:59'
    }), link)
  var timeWrap = `<div class="shortcut"><a href="${todayLink}">今</a><a href="${yesterday}">昨</a><a href="${theDayBeforeYesterday}">前</a></div>`
  if (!isRange || /内容分析|吸引力分析|访问者信息/.test($.trim($el.closest('.nav-level-2').siblings('.nav-item-1-title').text()))) {
    $el.parent().append(timeWrap)
  }
})

$('[data-nav-time]').on('click', function (event) {
  event.preventDefault()
  var $this = $(this)
  var time = $this.attr('data-nav-time').split('&')
  var $form = $this.closest('form')
  if (!$this.hasClass('btn-primary') || !$this.hasClass('next-disable')) {
    $form.find('[name="start"]').val(time[0])
    $form.find('[name="stop"]').val(time[1])
    $form.trigger('submit')
  }
})

if (ERRORS && ERRORS !== 'undefined') {
  let err = JSON.parse(ERRORS)
  $.alert({
    text: err.msg[0].value.split(' ')[1],
    status: 0,
    timeout: 5000
  })
}

// 用于帮助tips提示小窗
$('.tips-help').on({
  mouseenter: function () {
    $(this).addClass('show-tips-content')
  },
  mouseleave: function () {
    $(this).removeClass('show-tips-content')
  }
})

// 表头固定
$('.c-table-fixed').IUI('tableHeaderFix', {
  scrollEl: $('.main')
})

