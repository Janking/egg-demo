let defaults = {
  onChange() {

  }
}
let action = {
  show: function (event) {
    let _this = this
  }
}

function json2option() {
  let _this = this
  let data = _this.config.data
  let html = ''
  $.each(data, function (index, item) {
    if (item.id) {
      html += `<option ${item.selected === 1 ? 'selected' : ''} value="${item.id}" data-name="${item.name}">${item.name}</option>`
    }
  })
  return html
}

function json2el() {
  let _this = this
  let data = _this.config.data
  let html = ''
  $.each(data, function (index, item) {
    if (item.id) {
      html += `<li class="c-cascader__list__item" ${item.selected === 1 ? 'selected' : ''} data-value="${item.id}" data-name="${item.name}">${item.name}</li>`
    } else {
      html += `<li class="${item.type ? 'c-cascader__list__title' : 'c-cascader__list__folder'} ">${item.name}</li>`
    }
  })
  return html
}
/*
*/
function CityCascader(options, selector) {
  let _this = this
  _this.config = $.extend({}, defaults, options)
  _this.$el = $(selector)
  _this.$select = _this.$el.find('select')
  _this.init()
  _this.bindEvent()
}
CityCascader.prototype.init = function () {
  this.$select.wrapAll(`
  <div class="c-cascader">
    <div class="c-cascader__name"></div>
    <div class="c-cascader__search"><input type="text"></div>
    <ul class="c-cascader__list"></ul>
  </div>`)
  this.$wrap = this.$el.find('.c-cascader')
  this.$name = this.$el.find('.c-cascader__name')
  this.$list = this.$el.find('.c-cascader__list')
  this.$select.html(json2option.call(this))
  this.$list.html(json2el.call(this))
  this.$name.text(this.$select.find('option[value="' + this.$select.val() + '"]').text())
}

CityCascader.prototype.bindEvent = function () {
  this.$wrap.on('click', '.c-cascader__name', $.proxy(action.show, this))
}

module.exports = {
  cityCascader: function (options) {
    return this.each(function (index, el) {
      $(el).data('iui-cityCascader', new CityCascader(options, el))
    })
  }
}

/*

  $('select').IUI('cityCascader',{

  })

  var cityCascader = $('select').data('iui-cityCascader')
*/
