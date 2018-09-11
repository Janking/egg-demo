/**
 * emailSuffix 组件
 * @param {String}      container               组件的执行上下文
 * @param {String}      style                   组件被 append 的位置，若为global，则 append to container，否则将插入到和被调用元素的同一级节点中
 * @param {String}      item                    邮箱后缀列表 li 的 class
 * @param {String}      current                 邮箱后缀列表 li 的选中 class
 * @param {Array}       emails                  常用邮箱后缀，若要增加新邮箱后缀，需要复写原有默认的邮箱，否则数组将会被覆盖
 * @param {Number}      delay                   delay 毫秒后隐藏列表
 * @param {Number}      offsetLeft              组件定位 - left
 * @param {Number}      offsetTop               组件定位 - top
 * @param {Number}      offsetWidth             组件宽度 - width
 * @param {Number}      offsetHeight            组件高度 - height
 * @param {Function}    checkedCall             回调函数，选中后触发
 */


module.exports = {
  tableHeaderFix: function (options) {
    return this.each(function () {
      var defaults = {
        scrollEl: $('body'),
        offsetTop:$('.header-new-report').height()
      };
      var $selector = $(this);
      var config = $.extend({}, defaults, options);
      $selector.find('thead').append($($selector.find('thead').html()).addClass('hide'));

      config.scrollEl.on('scroll', function () {
        var colsWidths = $selector.find('tbody tr:first td').map(function () { return $(this).width() })
        $selector.find('thead tr:eq(1) th').each(function (i, element) { $(this).width(colsWidths[i]) })
        $selector.find('thead tr:eq(1)').css('top', config.offsetTop + 'px');

        if (($selector.offset().top - config.offsetTop < 0) && ($('body').scrollTop() - $selector.offset().top - $selector.height() + 60) < 0) {
          $selector.find('thead tr').eq(0).addClass('fixed')
          $selector.find('thead tr:eq(1) th').css('white-space', 'normal')
        } else {
          $selector.find('thead tr').eq(0).removeClass('fixed')
        }
      })

    });

  }
};
