module.exports.usercenter = `<script type="text/html" id="tpl-mobile">
<div class="layer-header clearfix">
  <div class="pull-left">
    <div class="layer-title">{{title}}</div>
  </div>
  <div class="pull-right">
    <a href="javascript:;" class="btn-close icon-close"></a>
  </div>
</div>
<form action="{{formUrl}}" class="c-form-vertical form-vlidMobile" onsubmit="return false">
  <div class="layer-body">
    <div class="form-group clearfix">
      <div class="col-2">
        <label class="form-label">手机号：</label>
      </div>
      <div class="col-7 pr">
        <input type="text" class="form-control" name="smsNum" data-required="smsNum" maxlength="11">
      </div>
    </div>
    <div class="form-group clearfix">
      <div class="col-2">
        <label class="form-label">验证码：</label>
      </div>
      <div class="col-4 pr">
        <input type="text" class="form-control" name="code" data-required="code" maxlength="6">
      </div>
      <div class="col-3">
        <button class="btn btn-m btn-default btn-all tcolor-light" type="button" id="vlid-mobile-code" data-appid="2069817081" data-cbfn="callbackSms" disabled>发送验证码</button>
      </div>
    </div>
    <div class="form-grounp clearfix tc mt50">
      <a href="javascipt:;" class="btn btn-m btn-default mr20 btn-close">取消</a>
      <button class="btn btn-m btn-primary" type="submit">确定</button>
    </div>
  </div>
</form>
</script>
<script type="text/html" id="tpl-hasmobile">
<div class="layer-header clearfix">
  <div class="pull-left">
    <div class="layer-title">安全验证</div>
  </div>
  <div class="pull-right">
    <a href="javascript:;" class="btn-close icon-close"></a>
  </div>
</div>
<div class="tc tf-s lh-s tcolor-light mt20">
  温馨提示：为了保护您的帐号安全，修改{{title}}前请先进行安全验证。
  <br> 如果无法收到验证码，请查看垃圾箱或者联系客服：
  <a href="mailto:online@contact.51.la">online@contact.51.la</a>
</div>
<form action="{{formUrl}}" class="c-form-vertical form-setHasMobile" onsubmit="return false">
  <div class="layer-body">
    <div class="form-group clearfix">
      <div class="col-2">
        <label class="form-label">手机号：</label>
      </div>
      <div class="col-7 pr">
        <p class="mt5">{{smsNum}}</p>
      </div>
    </div>
    <div class="form-group clearfix">
      <div class="col-2">
        <label class="form-label">验证码：</label>
      </div>
      <div class="col-4 pr">
        <input type="text" class="form-control" name="code" data-required="code" maxlength="6">
      </div>
      <div class="col-3">
        <button class="btn btn-m btn-default btn-all tcolor-light" type="button" id="reset-hasmobile-code">发送验证码</button>
      </div>
    </div>
    <div class="form-grounp clearfix tc mt50">
      <a href="javascipt:;" class="btn btn-m btn-default mr20 btn-close">取消</a>
      <button class="btn btn-m btn-primary" type="submit">确定</button>
    </div>
  </div>
</form>
</script> `
