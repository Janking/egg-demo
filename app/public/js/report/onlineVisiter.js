require('./common/datepicker')
var Pagination = require('./common/pagination')

// 在线访问者
{
  let $table = $('#table-onlineVisiter')
  // let $nodata = $table.next('.none-data-box')
  let $form = $('#form-onlineVisiter')

  if ($('#table-onlineVisiter').length) {
    var pagination = new Pagination($form, { data: chartData.data.listPage, url: window.location.href }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }
  $('body').on('click', '.sort', function (event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $form.submit()
  })

  $('body').on('click', '.sort2', function (event) {
    $('[name="dataType"]').val($(this).attr('data-dataType'))
    $form.submit()
  })
}

/**
 * 在线访问者 - IP追踪
 */

{
  let $table = $('#table-onlineVisiterDetail')
  // let $nodata = $table.next('.none-data-box')
  let $form = $('#form-onlineVisiterDetail')
  if ($('#table-onlineVisiterDetail').length && chartData.data) {
    let pagination = new Pagination($form, { data: chartData.data, url: window.location.href }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }
  $('body').on('click', '.sort', function (event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $form.submit()
  })

  $('body').on('click', '.sort2', function (event) {
    $('[name="dataType"]').val($(this).attr('data-dataType'))
    $form.submit()
  })
}

/**
 * 访问明细
 */


if ($('#form-visitDetail').length) {
  let $form = $('#form-visitDetail')
  let $dateBtn = $('#J-date, .date-group-1').find('a')
  $dateBtn.on('click', function () {
    let $this = $(this)
    $form.find('[name="date"]').val($this.data('time'))
    window.location.href = '/report/visit_details?' + $form.serialize()
  })

  $('.btn-device').find('a').on('click', function () {
    let $this = $(this)
    $form.find('input[name="isPc"]').val($this.data('device'))
    window.location.href = '/report/visit_details?' + $form.serialize()
  })

  $form.on('submit', function (event) {
    event.preventDefault()
    window.location.href = '/report/visit_details?' + $form.serialize()
  })

  $('#tabs-onlineVisiter').on('click', 'a', function (event) {
    event.preventDefault()
    let $this = $(this)
    $form.find('[name="type"]').val($this.data('type'))
    window.location.href = '/report/visit_details?' + $form.serialize()
  })

  if ($('#tabs-content').length) {
    let pagination = new Pagination($form, { data: chartData.data, url: location.href }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }

  // 日期不是今天，点击ip传ip至后台
  $('.visit-detail-ip').on('click', function () {
    let ipValue = $(this).data('value')
    $('[name="ip"]').val(ipValue)
    $('#form-visitDetail').submit()
  })
}

/**
 * 升降榜
 */
{
  let $table = $('#table-lifting')
  // let $nodata = $table.next('.none-data-box')
  let $form = $('#form-lifting')

  if ($('#table-lifting').length && chartData.data.pageInfo.list) {
    let pagination = new Pagination($form, { data: chartData.data.pageInfo, url: window.location.href }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }

  $('.form-filter').on('click', 'a', function (event) {
    event.preventDefault()
    $.each($(this).data(), function (index, value) {
      $('[name="' + index + '"]').val(value)
    })
    $form.submit()
  })

  $('.form-filter').find('a').each(function (index, el) {
    let changeType = $('[name="changeType"]').val()
    let sortId = $('[name="sortId"]').val()
    let sortType = $('[name="sortType"]').val()
    if ($(el).data('changeType') == changeType && $(el).data('sortId') == sortId && $(el).data('sortType') == sortType) {
      $(el).addClass('active')
      return false
    }
  })

  let $tableKeyword = $('#table-keyword')
  // let $nodata = $tableKeyword.next('.none-data-box')
  if ($tableKeyword.length) {
    let render = template.compile($('#tpl-keyword').html())
    let html = render(chartData.report)
    $tableKeyword.find('tbody').html(html)
  }
  $tableKeyword.on('click', '.sort', function (event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $formKeyword.submit()
  })
}
