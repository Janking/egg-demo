module.exports = function () {
  /**
   * 分组管理
   * 分组增删改查功能
   */
  function groupIdCU(data, target) {
    var _data = data || {
      title: '新建分组',
      url: '/user/siteGroup/add',
      msg: '创建成功'
    }
    var createGroupLayer = $('#layer-createGroup').IUI('layer', {
      content: template.compile($('#tpl-createGroup').html())(_data),
      dynamic: true,
      offsetWidth: 800
    })

    createGroupLayer.showLayer()

    // jscolor.installByClassName('jscolor')

    var createGroupValidate = $('#layer-createGroup').IUI('validate', {
      collections: [{
        required: 'groupName',
        context: '.col-5',
        matches: {
          isNonEmpty: {
            errMsg: '分组名不能为空'
          },
          strictLength: {
            errMsg: '分组名称长度超过16字符，1汉字=2个字符',
            max: 16
          }
        }
      }]
    })

    $('.form-createGroup').IUI('ajaxForm', {
      before: function (event, config) {
        let $this = $(this)
        if (createGroupValidate.batch() === false) {
          return false
        }
        config.data = $this.serialize() + '&_csrf=' + $('[name="_csrf"]').val()
      },
      success: function (res) {
        if (res.code === 200) {
          $('.form-createGroup').addClass('disabled')
          var formParamArr = createGroupLayer.$selector.find('form').serializeArray()
          var formParamArrList = []
          $.each(formParamArr, function (index, value) {
            formParamArrList.push(value.value)
          })

          if (target) {
            var name = target.find('.name')
            var radio = target.find('[type="radio"]')
            var input = target.find('[type="text"]')
            var editor = target.find('#inner-editor')
            target.find('[name="store"]').val(JSON.stringify(res.data))
            name.html(formParamArrList[1])
            input.css('background-color', formParamArrList[3])
            input.val(formParamArrList[3])
            editor.html(formParamArrList[3])
            radio.removeAttr('checked')
            target.find('[value="' + formParamArrList[2] + '"]').prop('checked', true)
          }
          $.alert({
            text: res.code === 200 ? _data.msg : res.msg[0].value,
            status: 3,
            timeout: 1000,
            callback: function () {
              if (res.code === 200) {
                createGroupLayer.hideLayer()
                window.location.href = window.location.href
              }
            }
          })
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 2,
            timeout: 1000,
            callback: function () {
              if (res.code === 200) {
                createGroupLayer.hideLayer()
                // window.location.href = window.location.href
              }
            }
          })
        }
      }
    })
  }
  // 移除分组
  $('body').on('click', '.remove', function (event) {
    var $this = $(this)
    var groupName = $this.closest('.item').find('input').val()
    $.dialog({
      content: '<div class="fb f20 c333 tc">确定要删除分组“' + groupName + '”吗？</div><div class="tc mt5">(属于该分组的统计ID不会被删除)</div>',
      type: 'confirm',
      closeBtn: true,
      confirm: function (deferred) {
        $.post($this.attr('data-url'), { _csrf: $('[name="_csrf"]').val() }).then(function (res) {
          if (res.code === 200) {
            $this.closest('.item').fadeOut(300, function () {
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
  // 修改分组

  $('body').on('click', '.update-group', function () {
    var $this = $(this)
    var $input = $this.closest('.item').find('.update-input')
    $input.addClass('input-style').focus()
    $this.text('确定').addClass('update-submit').removeClass('update-group')
  })

  $('body').on('click', '.update-submit', function () {
    var $this = $(this)
    var $input = $this.closest('.item').find('.update-input')
    var updateName = $input.val()
    var updateId = $input.attr('data-updateId')
    $.post($input.attr('data-edit'), { groupName: updateName, groupId: updateId, _csrf: $('[name="_csrf"]').val() }).then(function (res) {
      if (res.code === 200) {
        $.alert({
          text: '修改分组名成功',
          status: 3,
          timeout: 2000,
          callback: function () {
            $input.removeClass('input-style')
            $this.text('编辑').addClass('update-group').removeClass('update-submit')
          }
        })
      } else {
        $this.data('lock', false)
        $.alert({
          text: res.msg[0].value,
          status: 0
        })
      }
    })
  })

  $('.btn-createGroup').on('click', function (event) {
    groupIdCU()
  })

  if ($('body').find('.btn-createGroup').length) {
    $.sub('getSiteList', function (event, res) {
      // 修改分组弹层
      var editGroupLayer = $('#layer-editGroup').IUI('layer', {
        content: template.compile($('#tpl-editGroup').html())({ data: $('.mod-cotroller-site-list').data('siteGroup') }),
        dynamic: true,
        offsetWidth: 700,
        cancelCall: function () {
          window.location.href = window.location.href
        }
      })
      $('body').find('.btn-editGroup').on('click', function () {
        editGroupLayer.showLayer()
      })
    })
  }
}
