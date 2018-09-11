let siteList = `
<script type="text/html" id="tpl-removeSite">
<form class="fomr-vertical form-removeSite" action="/user/site/remove" onsubmit="return false">
  <input type="hidden" name="comId" class="input-siteId">
  <div class="layer-header clearfix">
    <div class="pull-left">
      <div class="layer-title">删除ID</div>
    </div>
    <div class="pull-right"><a href="javascript:;" class="btn-close icon-close"></a></div>
  </div>
  <div class="layer-body">
    <p class="text-danger">删除后将不可恢复！您真的要删除这个统计ID吗？</p>
    <p>如果您只是为了清除数据，则可以使用初始化功能，这样统计ID和统计代码将不会改变。</p>
    <p class="mt20">如果您的详情数据较多（比如有成千上万的页面或者关键词），并且使用统计时间较长时，则删除操作可能需要很长时间。在此期间请您耐心等待，不要关闭窗口或者切换到其它页面。如果中途出错，您可以重新进行删除操作。</p>
    <p class="mt20 text-danger">谨慎！谨慎！！谨慎！！！</p>

    <div class="form-group-sm">
      <div class="form-vertical mt20">
        <div class="col-2 tl">
          <label class="name-sm">密码确认</label>
        </div>
        <div class="col-4 pr">
          <input type="password" name="pass" class="form-control-sm" placeholder="密码" data-required="pass" class="form-control-sm">
        </div>
        <div class="col-5 text-muted f14 ml20 mt5">
          ( 请输入您的登录密码 )
        </div>
      </div>
    </div>
  </div>
  <div class="layer-footer">
    <a href="javascript:;" class="btn btn-close btn-default">取消</a>
    <button type="submit" class="btn btn-danger ml40">删除</button>
  </div>
</form>
</script>
<script id="tpl-createGroup" type="text/html">
<div class="layer-header clearfix">
  <div class="pull-left">
    <div class="layer-title">{{title}}</div>
  </div>
  <div class="pull-right"><a href="javascript:;" class="btn-close icon-close"></a></div>
</div>
<form class="c-form-vertical c-form-vertical-s form-createGroup" action="{{url}}" onsubmit="return false">
  {{if groupId}}
  <input type="hidden" name="groupId" value="{{groupId}}"> {{/if}}
  <input type="hidden" name="groupShow" value="1">
  <input type="hidden" name="groupColor"  value="#fff">
  <div class="layer-body">
    <div class="form-group">
      <div class="col-2"><label class="form-label">分组名称</label></div>
      <div class="col-5 pr"><input type="text" maxlength="8" name="groupName" data-required="groupName" class="form-control" value="{{groupName}}"></div>
      <div class="col-4 text-muted mt5">8个字符（或8个汉字）以内</div>
    </div>
  </div>
  <div class="layer-footer">
    <a href="javascript:;" class="btn btn-close btn-default">取消</a>
    <button type="submit" class="btn btn-primary ml20">确定</button>
  </div>
</form>
</script>
<script id="tpl-editGroup" type="text/html">
<div class="layer-header clearfix">
  <div class="pull-left">
    <div class="layer-title">编辑分组</div>
  </div>
  <div class="pull-right"><a href="javascript:;" class="btn-close icon-close"></a></div>
</div>
<div class="layer-body mod-cotroller-sitegroup-edit">
  <div class="edit-content">
    <div class="edit-header clearfix">
      <div class="pull-left">分组名称（8个字符或8个汉字内）</div>
      <div class="pull-right">操作</div>
    </div>
    <div class="edit-body">
      {{each data as item}}
      {{if item.groupId !== 1}}
      <div class="item clearfix">
        <div class="pull-left"><input type="text" value="{{item.groupName}}" maxlength="8" name="groupName" data-edit="/user/siteGroup/update" data-updateId="{{item.groupId}}" data-required="groupName" class="update-input"></div>
        <div class="pull-right lh-l"><a href="javascript:;" data-url="/user/siteGroup/delete?groupId={{item.groupId}}" class="remove">删除</a></div>
        <div class="pull-right lh-l mr20"><a href="javascript:;" class="update-group">编辑</a></div>
      </div>
      {{/if}}
      {{/each}}
    </div>
  </div>
</div>
</script>
<script type="text/html" id="tpl-siteList">
{{each data.sites as item}}
  <tbody class="item {{ currentGroupId === -1 || currentGroupId == item.groupId ? '' : 'hide'}}" data-groupid="{{item.groupId}}" data-groupshow="{{item.groupShow}}" data-site-id="{{item.comId}}">
    <tr>
      <td class="br" class="pl20">
        <div>{{item.siteName}}</div>
        <a class="site-list-website" target="_blank" title="{{item.url}}" href="{{item.url}}">{{item.url }}</a>
      </td>
      <td>
        {{item.comId}}
      </td>
      <td>
        <div class="tl">今日</div>
        <div class="tl mt5 tcolor-light">昨日</div>
      </td>
      <td class="tr">
        <div>{{item.stat.todayIp | numformat}}</div>
        <div class="mt5 tcolor-light">{{item.stat.yesterdayIp | numformat}}</div>
      </td>
      <td class="tr">
        <div>{{item.stat.todayPv | numformat}}</div>
        <div class="mt5 tcolor-light">{{item.stat.yesterdayPv | numformat}}</div>
      </td>
      <td class="tc"><a href="javascript:;" class="btn-updateGroup" data-comid="{{item.comId}}" data-id="{{item.groupName ? item.groupId : 1}}">{{item.groupName || '未分组'}}</a></td>
      <td rowspan="2">
        <a href="/report/main?comId={{item.comId}}" data-url="/report/visit_details?comId={{item.comId}}" class="mr10">查看报表</a>
        <a href="/report/manage/statistics?comId={{item.comId}}" class="mr10">获取代码</a>
        <a href="/report/manage/setup?comId={{item.comId}}" class="mr10">设置</a>
        <a href="javascript:;" data-id="{{item.comId}}" class="btn-removeSite">删除</a>
      </td>
    </tr>
  </tbody>
{{/each}}
</script>`

module.exports.siteList = siteList
