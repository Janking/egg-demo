module.exports = function () {
  // 分页器组件
  var Pagination = require('../../report/common/pagination')
  if ($('#feedback-container').length) {
    var $form = $('#form-keyword')
    var pagination = new Pagination($form, {
      data : paginationDate.data,
      url  : window.location.href
    }).init($('#pagination-context'))
    var $tableKeyword = $('#table-keyword')
    $('#pagination-context').html(pagination)
    $tableKeyword.on('click', '.c-table-btn-sort', function (event) {
      $('[name="sortType"]').val($(this).attr('data-sortType'))
      $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0)
      $form.submit()
    })
    $form.on('submit', function (event) {
      event.preventDefault()
      window.location.href = '/user/feedback?' + $form.serialize()
    })
  }
}
