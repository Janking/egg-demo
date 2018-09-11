// 新闻页 分页实例化
let Pagination = require('../report/common/pagination')
if ($('.news-lists').length) {
  var $form = $('#news-form')
  var pagination = new Pagination($form, {
    data: chartData.data,
    url: window.location.href
  }).init($('#pagination-context'))
  $('#pagination-context').html(pagination)

  $form.on('submit', function (event) {
    event.preventDefault()
    window.location.href = '/news/list?' + $form.serialize()
  })
}

var validate = $('.form-apply').IUI('validate', {
  collections: [{
    required: 'mobile',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '手机号码不能为空'
      },
      isMobile: {
        errMsg: '手机号码格式不正确'
      }
    }
  }]
})
// 点击label统计
$('body').on('click', '.label-item', function (event) {
  var $this = $(this)
  $.post($this.attr('data-url')).then(function (res) {
    if (res.code === 200) {

    } else {
      $.alert({
        text: res.msg[0].value,
        status: 0
      })
    }
  })
})

// 
$('.form-apply').IUI('ajaxForm', {
  before: function () {
    if (validate.batch() === false) {
      return false
    }
  },
  success: function (res) {
    $.post('/article/registerClick/add').then(function (res) {
      if (res.code === 200) {

      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        })
      }
    })
    var $mobile = $('.form-apply').find('#mobile').val()
    window.location.href = "/register?smsNum=" + $mobile
  }
})
