require('./common/datepicker')
// let echarts = require('echarts/lib/echarts')
// require('echarts/lib/chart/map')
// require('../vendor/map.china')
// require('echarts/lib/chart/pie')
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
var Pagination = require('./common/pagination')

{
  let $provinceSelect = $('[name="province"]')
  if ($provinceSelect.length) {
    $.get('/region').done(function (res) {
      let str = ''
      $.each(res, function (i, item) {
        if (item.pid === 100000) {
          str += '<option  value="' + (item.name) + '" ' + ($provinceSelect.attr('data-value') === item.name ? 'selected' : '') + '>' + (item.name) + '</option>'
        }
      })
      $provinceSelect.append(str)
    })
  }

  // 表格悬浮
  // 表头fixed
  function fixeTable(tableName) {
    $('.main-nested').scroll(function () {
      var colsWidths = $(tableName).find('tbody tr:first td').map(function () {
        return $(this).width()
      })

      $(tableName).find('thead tr:eq(1) th').each(function (i, element) {
        $(this).width(colsWidths[i])
      })
      var headerHeight = $('.header-new-report').height()
      // if (($('body').scrollTop() + 50) > $(tableName).offset().top && ($('body').scrollTop() - $(tableName).offset().top - $(tableName).height() + 60) < 0) {
      $(tableName).find('thead tr:eq(1)').css('top', headerHeight + 'px')
      if (($(tableName).offset().top - headerHeight < 0) && ($('body').scrollTop() - $(tableName).offset().top - $(tableName).height() + 60) < 0) {
        $(tableName).find('thead tr').eq(0).addClass('fixed')
        $(tableName).find('thead tr:eq(1) th').css('white-space', 'normal')
      } else {
        $(tableName).find('thead tr').eq(0).removeClass('fixed')
      }
    })
  }
  // 表头实例化
  if ($('.c-tabld-region').length) {
    fixeTable('.c-tabld-region')
  }

  // 分页和排序
  if ($('.table-map').length && chartData.data) {
    var $form = $('body').find('.form-region')
    var pagination = new Pagination($form, {
      data : chartData.data,
      url  : window.location.href
    }).init($('#pagination-context'))
    var $tableKeyword = $('.table-map')
    $('#pagination-context').html(pagination)
    $tableKeyword.on('click', '.c-table-btn-sort', function (event) {
      $('[name="sortType"]').val($(this).attr('data-sortType'))
      $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0)
      $form.submit()
    })
  }

  // 表格
  $('.btn-expand').on('click', function () {
    $(this).find('.iconfont').toggleClass('icon-fa-minus-square-o').toggleClass('icon-fa-plus-square-o')
    $(this).closest('tr').nextUntil(':not(.tr-nested)').toggle('active')
  })

  // 斑马线
  $('body').find('.nozebra:odd').css('background-color', '#FAFAFA')
  // // 输入列表数目
  // let listNum = 0
  // $.each(chartData.data.list, function (index, value) {
  //   if (value.mergerName) {
  //     listNum++
  //   }
  // })

  // $('#user-list-num').html('共' + listNum + '项')
}
