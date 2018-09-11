var $startTime = $('#datepicker-start');
var $endTime = $('#datepicker-end');
var $today = $('.today');
var today = $today.attr('data-time');
var $dates = $('.J-dates-context');
var start = $startTime.val() ? new Date($startTime.val()) : new Date();
start.setHours(0);
start.setMinutes(0);
var end = $endTime.val() ? new Date($endTime.val()) : new Date();
end.setHours(0);
end.setMinutes(0);
$startTime.datepicker({
    timepicker: false,
    dateFormat: 'yyyy-mm-dd',
    startDate: start,
    onSelect: function (date, datetime, datepicker) {
        // datepicker.$el.val(date + ':00');
        if (date + ':00' == today && $('[data-time="' + $endTime.val() + '"]').length) {
            $('[data-time="' + $endTime.val() + '"]').trigger('click');
        } else {
            $dates.find('a').addClass('btn-default').removeClass('btn-primary');
        }
    }
});

$endTime.datepicker({
    timepicker: false,
    dateFormat: 'yyyy-mm-dd',
    startDate: end,
    onSelect: function (date, datetime, datepicker) {
        // datepicker.$el.val(date + ':00');
        if ($startTime.val() == today && $('[data-time="' + $endTime.val() + '"]').length) {
            $('[data-time="' + $endTime.val() + '"]').trigger('click');
        } else {
            $dates.find('a').addClass('btn-default').removeClass('btn-primary');
        }
    }
});

if ($startTime.val()) {
    $startTime.val($startTime.val().split(' ')[0]);
    $endTime.val($endTime.val().split(' ')[0]);
} else {
    $startTime.val(today.split(' ')[0]);
    $endTime.val(today.split(' ')[0]);
}



$dates.on('click', 'a', function (event) {
    event.preventDefault();
    var $this = $(this);
    $this.removeClass('btn-default').addClass('btn-primary').siblings('.btn-primary').removeClass('btn-primary').addClass('btn-default');

    if ($this.attr('data-key') == '近7天' || $this.attr('data-key') == '近一月') {
        $startTime.val($this.attr('data-time').split(' ')[0]);
        $endTime.val(today.split(' ')[0]);
    } else {
        $startTime.val($this.attr('data-time').split(' ')[0]);
        $endTime.val($this.attr('data-time').split(' ')[0]);
    }

});

$('[name="isAll"]').on('change', function (event) {
    $('[type="checkbox"]').prop('checked', this.checked);
});

$('.form-download').IUI('ajaxForm', {
    success: function (res) {
        if (!res.flag) {
            $.alert({
                text: res.msg
            });
        } else {
            window.location.href = `/report/download/detail?comId=${COMID}&downloadId=${res.data}`;
        }
    }
});
