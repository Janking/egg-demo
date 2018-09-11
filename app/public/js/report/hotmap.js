(function () {
  /**
   * 添加热力图
   */
  function groupHotmap(data, target) {
    var _data = data || {
      title: '新建热力图',
      url: '',
      msg: '创建成功'
    }
    var creatHotmapLayer = $('#layer-createHotmap').IUI('layer', {
      content: template.compile($('#tpl-createHotmap').html())(_data),
      dynamic: true,
      offsetWidth: 800
    })

    creatHotmapLayer.showLayer()

    var createHotmapValidate = $('#layer-createHotmap').IUI('validate', {
      strategy: {
        httpReg: function () {
          var $target = this.self
          var value = $.trim($target[0].value)
          if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
            return false
          }
        }
      },
      collections: [{
          require: '',
          context: '.col-20',
          matchs: {
            isNonEmpty: {
              errMsg: '热力图名称不能为空'
            },
            strictLength: {
              errMsg: '分组名称长度超过40字符，1汉字=2个字符',
              max: 40
            }
          }
        },
        {
          required: 'url',
          context: '.col-20',
          matches: {
            isNonEmpty: {
              errMsg: '网站地址不能为空'
            },
            httpReg: {
              errMsg: '请填写正确的网站地址'
            }
          }
        }
      ]
    })

    $('.form-creatHotmap').IUI('ajaxForm', {
      before: function () {
        if (createHotmapValidate.batch() === false) {
          return false
        }
      },
      success: function (res) {

      }
    })

  }

  // 移除分组
  $('body').on('click', '.remove', function (event) {
    var $this = $(this)
    var groupName = $this.closest('tr').find('.name').text()
    $.dialog({
      content: '<div class="fb f20 c333 tc">确定要删除分组“' + groupName + '”吗？</div><div class="tc mt5">(属于该分组的统计ID不会被删除)</div>',
      type: 'confirm',
      closeBtn: true,
      confirm: function (deferred) {
        $.post($this.attr('data-url')).then(function (res) {
          if (res.code === 200) {
            $this.closest('tr').fadeOut(300, function () {
              $(this).remove()
            })
          } else {
            $this.data('lock', false)
            $.alert({
              text: res.msg[0].value,
              status: 0
            })
          }
        })
        deferred.hideDialog()
      }
    })
  })

  $('.btn-createHotmap').on('click', function (event) {
    groupHotmap()
  })
})()
