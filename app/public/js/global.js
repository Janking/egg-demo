//  全局引入样式
// require('../sass/style.scss')
require('../sass2/front2.scss')

var inject = require('./vendor/iui/inject')
//  注入layer组件
inject(require('./vendor/iui/common/layer'), true)
inject(require('./vendor/iui/common/loading'), false)
//  注入validate组件
inject(require('./vendor/iui/functional/validate'), true)

inject(require('./vendor/iui/functional/ajaxForm'), true)

inject(require('./vendor/iui/functional/pubsub'), false)

inject(require('./vendor/iui/desktop/placeholder'), true)

inject(require('./vendor/iui/desktop/pagination'), true)

inject(require('./vendor/iui/desktop/tooltip'), false)

inject(require('./vendor/iui/common/alert'), false)

inject(require('./vendor/iui/common/dialog'), false)

inject(require('./vendor/iui/desktop/dropdown'), true)

inject(require('./vendor/iui/functional/cookie'), false)

require('./module/login')()

$('body').on('click', '.alert-close', function (event) {
  $(this).closest('.alert').remove()
  $.cookie.set('indexAlert', 1)
})

$('.username').on('click', function (event) {
  event.stopPropagation()
  $('.userexit').css('display', 'block')
})

$(document).on('click', function () {
  $('.userexit').css('display', 'none')
})

require('./module/returnTop')()
require('./module/adClick')()
