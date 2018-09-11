var laydate = require('../../vendor/laydate/laydate')

laydate.render({
  elem       : '#datepicker-single',
  min        : -45,
  max        : 0,
  showBottom : false,
  eventElem  : '.icon-fa-time',
  trigger    : 'click',
  done       : function () {
    $(this.elem).closest('form').trigger('submit')
  }
})

laydate.render({
  elem      : '#date-time-range-1',
  type      : 'datetime',
  max       : 0,
  range     : '~',
  trigger   : 'click',
  eventElem : '.icon-fa-time',
  done      : function (value, date) {
    var pick = value.split(' ~ ')
    var start = pick[0]
    var stop = pick[1]
    $('[name=start]').val(start)
    $('[name=stop]').val(stop)
  }
})

laydate.render({
  elem      : '#date-time-range-2',
  type      : 'date',
  range     : '~',
  trigger   : 'click',
  eventElem : '.icon-fa-time',
  max       : 0,
  done      : function (value, date) {
    var pick = value.split(' ~ ')
    var start = pick[0]
    var stop = pick[1]
    $('[name=start]').val(start)
    $('[name=stop]').val(stop)
  }
})
