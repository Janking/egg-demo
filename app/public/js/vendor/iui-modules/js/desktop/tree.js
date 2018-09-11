// 使用中文转拼音
let pinyin = require('../vendor/pinyin/web-pinyin.js')
// 隐藏原型链的值
/*
this.clickTarget(当前点击item),
this.jsonDataChild(可点击元素json),
this.treeId(id值)
this.activeBoxEle(填充选中值元素，attr(data-treebox)
*/
// 输出结果
// console.log(JSON.stringify(data, null, 2))
// >cotainer>content>title+list>content>title+list/item>name+1

let template = {
  item : `<div class="tree-item" data-value="{{value}}"> 
                <i class="tree-icon fa {{itemIcon}}" aria-hidden="true"></i>&nbsp; 
                <div class="tree-name">{{name}}</div> 
            </div>`,
  title : `<div class="tree-title">
                <i class="tree-icon fa {{titleIcon}}" aria-hidden="true"></i>&nbsp;
                <div class="tree-name" data-value="{{value}}" data-level="{{level}}" data-id="{{id}}">{{name}}</div>
            </div>`,
  wrap : `<div class="tree-wrap"></div>`,
  span : `<span class="tree-value" data-value="{{value}}">
                {{name}}
                <span class="tree-remove">×</span>
            </span>`,
  search : `<div class="tree-search-content">
                <input type="text" placeholder="请搜索" class="tree-search">
            </div>`,
  container : `<div class="tree-container">
                </div>`
}
template.content = `<div class="tree-content">` + template.title + `<div class="tree-list">
                    </div>
                </div>`

let $body = $('body')

let treeId = 1

// let containerTpl=`<div class="tree-container">
// </div>`;
let defaults = {
  jsonData      : null,
  // 可配置的json key
  value         : 'value',
  child         : 'child',
  name          : 'name',
  // 是否多选
  multiple      : true,
  // icon 配置
  itemIcon      : ['fa-file-text-o', 'fa-file-text-o'],
  titleIcon     : ['fa-folder-o', 'fa-folder-open-o'],
  // 是否排序：asc,des,false
  order         : 'asc',
  // 排序属性
  orderProp     : 'name',
  // 是否多选
  isMulti       : true,
  // 分割字符串
  splitStr      : '<br>',
  // 是否显示完整路径
  showPath      : true,
  // 是否开启搜索
  search        : true,
  // 选中值填充显示到哪里,默认：target
  activeBoxEle  : false,
  // 选中回调
  afterSelected : function () { },
  // 删除回调
  afterRemove   : function () { }

}
$body.on('click', function () {
  let $container = $('.tree-container')
  $container.length ? $('.tree-container').remove() : false
})

function Tree($target, options) {
  this.target = $target
  this.options = options

  this.activeBoxEle = this.options.activeBoxEle ? $(this.options.activeBoxEle) : this.target
  this.activeBoxEle.data('tree', this).attr('data-treeBox', true)
  this.treeId = treeId
  treeId++
  this.init()
}

Tree.prototype = {
  init : function () {
    // 添加外围标签
    var $wrap = $(template.wrap)
    this.target.after($wrap)
    this.wrap = $wrap.append(this.target).addClass('tree-wrap-' + this.treeId)
    // 处理json排序，添加字段
    this.jsonDataHandle()
    this.target.data('tree', this)
    // 增加父元素路径
    this.options.jsonDataChild = addParentPath.call(this)
    this.event()
    this.renderDefaults()
  },
  renderDefaults : function (vals) {
    var _this = this
    vals = valToArray.call(_this, vals)
    if (!vals) {
      return
    }
    this.getName(vals)
  },

  // 渲染默认值  vals:可选，逗号隔开。不传默认拿target的data-value
  renderActive : function (vals) {
    var _this = this
    vals = valToArray.call(_this, vals)
    if (!vals) {
      return
    }
    for (let i = 0, len = vals.length; i < len; i++) {
      _this.container.find('.tree-item[data-value="' + vals[i] + '"]').addClass('active')
    }
  },

  event : function () {
    let _this = this
    // 删除
    // 有问题，先留着
    this.activeBoxEle.on('click.treeval', '.tree-value', function (event) {
      event.stopPropagation()
      let $this = $(this)
      let val = $this.data('value')
      let _this = $this.parents('[data-treeBox]').data('tree')
      $this.remove()
      _this.remove.call(_this, val)
    })
    // 点击打开选择框
    this.target.off('click.tree').on('click.tree', function () {
      let $this = $(this)
      let _this = $this.data('tree')
      if (!$('.tree-container').length) {
        _this.show.call(_this)
        _this.container.data('tree', _this)
      }
      return false
    })

    // 点击展开收起子选项
    $body.off('click.tree').on('click.tree', '.tree-container .tree-title', function () {
      let _this = $('.tree-container').data('tree')
      let $this = $(this)
      $this.toggleClass('active').siblings('.tree-list').toggleClass('active')
      let i = $this.hasClass('active') ? 1 : 0
      $this.find('.tree-icon').removeClass(_this.options.titleIcon[1 - i]).addClass(_this.options.titleIcon[i])
    })

    // item选择
    if (_this.options.isMulti) {
      _this.multiEvent()
    } else {
      _this.singleEvent()
    }

    $body.on('click.tree', '.tree-container', function (e) {
      e.stopPropagation()
    })
  },
  // 多选
  multiEvent : function () {
    $body.on('click.tree', '.tree-container .tree-item', function () {
      let _this = $('.tree-container').data('tree')
      let $this = $(this)
      $this.toggleClass('active')
      _this.setValue($this)
    })
  },
  // 单选
  singleEvent : function () {
    $body.on('click.tree', '.tree-container .tree-item', function () {
      let _this = $('.tree-container').data('tree')
      let $this = $(this)
      $this.addClass('active')
      _this.container.find('.tree-item').not($this).removeClass('active')
      _this.setValue($this)
      _this.hide()
    })
  },
  // 显示
  show : function () {
    let _this = this
    let options = _this.options
    // 添加container
    _this.wrap.append(template.container)
    _this.container = $('.tree-container')
    _this.container.addClass('tree-container-' + _this.treeId)
    // 渲染html
    _this.iteratorAppendHtml()
    // 增加父元素路径
    if (options.search) {
      _this.addSearch()
    }
    _this.renderActive()
    getcontainerTop.call(_this)
  },
  // 隐藏
  hide : function () {
    this.container.remove()
  },
  // 更新数据
  update : function (data) {
    this.options.jsonData = data
    this.jsonDataHandle()
  },
  // 删除
  remove : function (val) {
    let _this = this
    let vals = _this.target.data('value')
    removeValue.call(_this, val, vals)
    if (_this.container.length) {
      _this.container.find('.tree-item[data-value="' + val + '"]').removeClass('active')
    }
  },
  // 设置选中值（$target：tree-item）
  setValue : function ($target) {
    let _this = this
    let val = $target.data('value')
    _this.clickTarget = $target
    if ($target.hasClass('active')) {
      addValue.call(_this, val)
      _this.options.afterSelected.call(_this, val)
    } else {
      removeValue.call(_this, val)
      _this.options.afterRemove.call(_this, val)
    }
  },

  // 拼接name值
  getName : function (vals) {
    let _this = this
    let result = getName.call(_this, vals)
    _this.activeBoxEle.html(result)
    return result
  },
  // 添加搜索
  addSearch : function () {
    let _this = this
    _this.container.prepend(template.search)
    _this.container.on('keyup.tree', '.tree-search', function (e) {
      if (e.which === 13) {
        _this.search()
      }
    })
  },
  search : function () {
    let _this = this
    let $search = _this.container.find('.tree-search')
    let val = $search.val()
    renderContainer.call(_this, val)
  },

  // 处理json排序，添加字段
  jsonDataHandle : function () {
    let _this = this
    if (!(_this.options.jsonData && _this.options.jsonData.length)) {
      return false
    }
    // 排序
    if (_this.options.order !== false) {
      order.call(_this)
    }
    _this.options.jsonData = jsonDataExtend.call(_this)
  },
  // jsonData增加属性（jqTreeParentVal：父元素值，jqTreeLevel：当前层级，treeId：当前层级index）

  // 非递归广度优先实现
  iteratorAppendHtml : function () {
    renderContainer.call(this)
  },
  // 获取选中值的名字，value全路径
  // 暴露给外部用
  getPath : function () {
    let _this = this
    let options = _this.options
    let child = _this.jsonDataChild
    let vals = _this.target.data('value')
    let valuePath = ''
    let namePath = ''
    let childVal
    if (vals) {
      valuePath = []
      namePath = []
      vals = vals.toString().split(',')
      for (let i = 0; i < vals.length; i++) {
        childVal = child[vals[i]]
        valuePath.push(childVal.valuePath)
        namePath.push(childVal.namePath)
      }
      valuePath = valuePath.join(options.split)
      namePath = namePath.join(options.split)
    }
    return {
      valuePath : valuePath,
      namePath  : namePath
    }
  }
}

// 排序
function order() {
  let _this = this
  let options = _this.options
  let child = options.child
  let jsonData = options.jsonData
  if (!jsonData || !jsonData.length) return
  let stack = []
  let item
  // 排序
  jsonData = sortResults.call(_this, jsonData)
  // 先将第一层节点放入栈
  stack = addStack(jsonData)
  while (stack.length) {
    item = stack.shift()
    // 如果该节点有子节点，继续添加进入栈顶
    if (item[child] && item[child].length) {
      item[child] = sortResults.call(_this, item[child])
      stack = item[child].concat(stack)
    }
  }
  return jsonData
}

// 添加栈
function addStack(jsonData) {
  var stack = []
  for (let i = 0, len = jsonData.length; i < len; i++) {
    stack.push(jsonData[i])
  }
  return stack
}

// 添加父元素路径
function addParentPath() {
  var _this = this
  _this.wrap.append(template.container)
  _this.container = $('.tree-container').hide()
  _this.iteratorAppendHtml.call(_this)
  let $item = _this.container.find('.tree-item')
  let $parent, namePath, valuePath, val, jsonChild

  // 渲染html
  // 添加父元素路径到子元素：jsonDataChild
  $.each($item, function (index, el) {
    namePath = []
    valuePath = []
    $parent = $(el).parents('.tree-content')
    val = $(el).data('value')
    jsonChild = _this.jsonDataChild[val]
    for (let i = $parent.length - 1; i >= 0; i--) {
      let $name = $parent.eq(i).find('.tree-name').first()
      namePath.push($name.text())
      valuePath.push($name.data('value'))
    }
    namePath.push(jsonChild.name)
    valuePath.push(val)
    jsonChild.namePath = namePath.join('/')
    jsonChild.valuePath = valuePath.join('/')
  })
  _this.container.remove()
  return _this.jsonDataChild
}
// 添加val
function addValue(val) {
  let vals = this.target.data('value')
  // 添加val
  vals = add.call(this, val)
  this.target.data('value', vals)
  return vals
}
// 添加val
function add(val) {
  let vals = this.target.data('value')
  // 单选
  if (!this.options.isMulti) {
    vals = ''
  }
  if (vals) {
    let len, i
    vals = vals.toString().split(',')
    for (i = 0, len = vals.length; i < len; i++) {
      if (vals[i] === val) {
        return vals
      }
    }
    vals.push(val)
    // 拼接name值
    this.getName(vals)
    vals = vals.join(',')
    return vals
  }
  // this.target.html(this.jsonDataChild[val].name);
  vals = val
  this.getName([vals])
  return vals
}
// 移除val
function removeValue(val) {
  let vals = remove.call(this, val)
  this.target.data('value', vals)
  return vals
}

// 渲染container
function renderContainer(val) {
  let _this = this
  let options = _this.options
  let jsonData = options.jsonData
  if (!jsonData || !jsonData.length) {
    return
  }
  let stack = []
  let child = options.child
  let name = options.name
  let $container = _this.container
  let item, isChild
  // 清空
  $container.find('.tree-content').remove()
  stack = addStack(jsonData)

  while (stack.length) {
    item = stack.shift()
    isChild = hasChild(item, child)
    if (item.jqTreeParentVal === -1) {
      // 第一级父元素
      $container.append(item.jqTreeCode)
    } else if (isRenderChild(item, name, isChild, val)) {
      // 当前匹配搜索或有子元素
      $container.find('[data-value="' + item.jqTreeParentVal + '"]').closest('.tree-content').find('.tree-list').first().append(item.jqTreeCode)
    }

    // 如果该节点有子节点，继续添加进入栈顶
    if (isChild) {
      stack = item[child].concat(stack)
    }
  }
  // 遍历去除无子元素的部分:搜索时执行
  if (val) {
    let $list = $container.find('.tree-list')
    $.each($list, function (index, list) {
      if (!$(list).find('.tree-item').length) {
        $(list).parents('.tree-content').first().remove()
      }
    })
  }
}

// 是否渲染子元素
// 不是搜索||有子元素||匹配搜索值
function isRenderChild(item, name, isChild, val) {
  return (!val || isChild || (item[name].indexOf(val) !== -1))
}

// 根据val值拼接name
function getName(vals) {
  let temp = []
  let name = this.options.showPath ? 'namePath' : 'name'
  let val
  for (let i = 0, len = vals.length; i < len; i++) {
    val = vals[i]
    console.info(this.jsonDataChild[val][name])
    temp.push(template.span.replace(/{{name}}/, this.jsonDataChild[val][name]).replace(/{{value}}/, val))
  }

  return temp.join(this.options.splitStr)
}

// 移除val
function remove(val) {
  let vals = this.target.data('value')
  val = val + ''
  // 多选，有值
  if (this.options.isMulti && vals) {
    vals = vals.toString().split(',')
    let temp = []
    for (let i = 0, len = vals.length; i < len; i++) {
      if (vals[i] !== val) {
        temp.push(vals[i])
      }
    }
    this.getName(temp)
    vals = temp.join(',')
  } else {
    vals = ''
    this.activeBoxEle.html('')
  }
  return vals
}

// vals转为数组
function valToArray(vals) {
  vals = vals || this.target.data('value')
  if (vals) {
    vals = vals.toString().split(',')
  } else {
    vals = false
  }
  return vals
}
// 排序
function sortResults(data) {
  let options = this.options
  let order = options.order
  let prop = options.orderProp

  data = data.sort(function (a, b) {
    let tempA = pinyin(a[prop]).join('')
    let tempB = pinyin(b[prop]).join('')
    if (order === 'asc') {
      return (tempA > tempB) ? 1 : ((tempA < tempB) ? -1 : 0)
    } else if (order === 'des') {
      return (tempB > tempA) ? 1 : ((tempB < tempA) ? -1 : 0)
    }
  })
  // console.info('sortResults',data)
  return data
}

// 判断是否有属性－－未兼容ie
function hasProp(data, prop) {
  // _this.options.child
  return ({}).hasOwnProperty.call(data, prop)
}

// 获取container top
function getcontainerTop() {
  let cHeight = this.container.outerHeight()
  this.container.hide()
  let bodyH = $body.outerHeight()
  this.container.show()
  let targetH = this.target.outerHeight()

  let targetT = this.target.offset().top
  // 大于最底部，小于最顶部
  if ((bodyH < targetH + cHeight + targetT) && (targetT - cHeight > 0)) {
    this.container.css({
      top    : 'inherit',
      bottom : '100%'
    })
  } else {
    this.container.css({
      bottom : 'inherit',
      top    : '100%'
    })
  }

  return top
}

function hasChild(item, child) {
  return hasProp(item, child) && item[child] && item[child].length
}

function jsonDataExtend() {
  let _this = this
  let options = _this.options
  let jsonData = options.jsonData
  if (!jsonData || !jsonData.length) {
    return
  }
  let stack = []
  let child = options.child
  let oname = options.name
  let ovalue = options.value
  _this.jsonDataChild = {}
  // 非递归广度优先
  // 先将第一层节点放入栈
  for (let i = 0, len = jsonData.length; i < len; i++) {
    jsonData[i].jqTreeLevel = 0
    jsonData[i].treeId = i
    jsonData[i].jqTreeParentVal = -1
    stack.push(jsonData[i])
  }

  let item,
    level,
    parentId
    // stack是所有的一级数组
  while (stack.length) {
    item = stack.shift()
    // 如果该节点有子节点，继续添加进入栈底
    if (hasChild(item, child)) {
      // 有子元素标志
      item.jqTreeHasChild = true
      // 元素层级标志
      level = item.jqTreeLevel + 1
      // 对用的html
      item.jqTreeCode = template.content.replace(/{{value}}/g, item[ovalue])
        .replace(/{{name}}/g, item[oname])
        .replace(/{{level}}/g, item.jqTreeLevel)
        .replace(/{{id}}/g, item.treeId)
        .replace(/{{titleIcon}}/g, options.titleIcon[0])
      // 父元素id
      parentId = item[ovalue]
      // 长度
      for (let i = 0, len = item[child].length; i < len; i++) {
        item[child][i].jqTreeLevel = level
        item[child][i].jqTreeParentVal = parentId
        item[child][i].treeId = i
      }
      stack = stack.concat(item[child])
    } else {
      // 无子元素
      item.jqTreeHasChild = false
      // tree-item html
      item.jqTreeCode = template.item.replace(/{{name}}/g, item[oname])
        .replace(/{{itemIcon}}/g, options.itemIcon[0])
        .replace(/{{value}}/g, item[ovalue])

      _this.jsonDataChild[item[ovalue]] = $.extend({}, {}, item)
    }
  }
  // this.options.jsonData=jsonData;
  return jsonData
}

module.exports = {
  tree : function (config) {
    return new Tree($(this), $.extend({}, defaults, config))
  }
}
