/**
 * checked 组件
 * parent               radio/checkbox 的父级class
 * obj                  调用的class
 * type                 类型(radio/checkbox) 默认radio
 * success              选择成功的回调
 * abandon              没选择的回调(checkbox)才有效
 */
import $ from 'jquery'
export default {
  ichecked : function ichecked(options) {
    var settings = $.extend({
      parent  : null,
      obj     : null,
      type    : 'radio',
      success : function success() { },
      abandon : function abandon() { }
    }, options)

    $(settings.obj).on('change', 'input[type="' + settings.type + '"]', function () {
      var $this = $(this)
      var $parents = $this.parents(settings.obj)

      $parents.find(settings.parent).removeClass('current')

      if ($this[0].checked) {
        $this.parent().addClass('current')
        settings.success.apply($this, [settings])
      } else {
        settings.abandon.apply($this, [settings])
      }
    })
  }
}
