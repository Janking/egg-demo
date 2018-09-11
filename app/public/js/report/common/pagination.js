
// <div class="c-paging-box">
//   <div class="c-paging-box-right">
//     <span class="total">共<i>{{total}}</i>条&nbsp&nbsp当前第{{pageNum}}页&nbsp&nbsp</span>
//     <span class="show-page">每页显示</span>&nbsp
//     <input type="text" class="show-page-num" maxlength="2" value="{{pageSize}}">&nbsp
//     <span class="show-page2">条</span>
//     <span class="text-go">跳转至</span>
//     <input type="text" maxlength="2" class="go-page">
//     <div class="box-a">
//         <a  href="javascript:;" data-perpage="{{prev}}" {{prev === 0 ? 'class=disabled' : ''}}>«</a>
//         {{each lists as item }}
//         <a  href="javascript:" data-perpage="{{item.index}}" {{item.isActive ? 'class=on' : ''}}>{{item.index}}</a>
//         {{/each}}
//         <a  href="javascript:;" data-perpage="{{next}}" {{next === 0 ? 'class=disabled' : ''}}>»</a>
//     </div>
//   </div>
// </div>
var pageTemplate = `
<div class="c-pagination-wrap clearfix">
  总共{{total}}条数据&nbsp&nbsp
  每页<input type="text" class="pagesize" role="text" maxlength="2" value="{{pageSize}}">
  跳转至<input type="text" class="goto" role="text" maxlength="2" data-maxpage="{{maxpage}}">
  <ul class="c-pagination">
    <li class="prev {{prev === 0 ? 'disabled' : ''}}" data-page={{prev}}><a href="javascript:;">«</a></li>
    {{each lists as item }}
      <li  {{item.isActive ? 'class=active' : ''}} data-page="{{item.index}}">
        <a href="javascript:;">{{item.index}}</a>
      </li>
    {{/each}}
    <li class="next {{next === 0 ? 'disabled' : ''}}" data-page="{{next}}"><a href="javascript:;">»</a></li>
  </ul>
</div>
`
function Pagination($form, option) {
  var _this = this
  _this.config = $.extend(true, {}, option)
  _this.$form = $form
  _this.template = pageTemplate
  _this.config.data.url = fixUrl(_this.config.url || _this.$form.attr('action') || '')
}

Pagination.prototype.init = function (selector) {
  var render = template.compile(this.template)
  var data = $.extend(true, {}, this.config.data)
  var serialize = this.$form.serialize()

  data.url += serialize
  data.prev = createPrev(data)

  data.next = createNext(data)

  data.lists = createLists(data)

  if (data.total === 0) {
    return false
  }

  this.event(selector)

  return render(data)
}

Pagination.prototype.event = function (selector) {
  var $selector = selector
  var _this = this

  $selector.on('click', '[data-page]', function (event) {
    event.preventDefault()
    var $this = $(this)
    if (!$this.hasClass('disabled')) {
      _this.$form.find('[name="pageNum"]').val($this.attr('data-page'))
      _this.$form.submit()
    }
  })

  $selector.on('keydown', '.goto', function (event) {
    var $this = $(this)
    if (event.keyCode === 13) {
      _this.$form.find('[name="pageNum"]').val($this.val())
      _this.$form.submit()
    }
  })

  $selector.on('keydown', '.pagesize', function (event) {
    var $this = $(this)
    if (event.keyCode === 13) {
      _this.$form.find('[name="pageSize"]').val($this.val())
      _this.$form.submit()
    }
  })
}

function createPrev(data) {
  var num = data.pageNum
  return data.pageNum === 1 ? 0 : num - 1
}

function createNext(data) {
  var num = data.pageNum
  return data.pageNum === data.pages ? 0 : num + 1
}

function fixUrl(url) {
  var _url
  if (url.indexOf('?') !== -1) {
    _url = url.split('?')[0]
  } else if (url.indexOf('#') !== -1) {
    _url = url.split('#')[0]
  } else {
    _url = url
  }

  return _url + '?'
}
function createLists(data) {
  let arr = []
  let queue = data.pages >= 5 ? 5 : data.pages
  let pageNum
  arr.length = queue
  if (data.pages < 5 || data.pageNum < 3) {
    pageNum = 1
  } else if (data.pageNum >= data.pages - Math.round(arr.length / 2)) {
    pageNum = data.pages - 4
  } else {
    pageNum = data.pageNum - 2
  }

  $.each(arr, function (index, value) {
    arr[index] = {
      index    : pageNum + index,
      isActive : (pageNum + index === data.pageNum)
    }
  })

  return arr.slice(0)
}

module.exports = Pagination
