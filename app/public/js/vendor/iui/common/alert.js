/**
 * alert 组件
 * @param {String}                 obj                 被提示的对象，可传 id 或 jQuery 对象
 * @param {String}                 text                文本信息
 * @param {Number}                 timeout             多少毫秒后隐藏提示
 * @param {Boolean}                status              状态，success or error
 * @param {Array}                  offset              自定义位置微调值，offset[0] = x, offset[1] = y
 * @param {Function}               callback            回调函数 - hide 时触发
 *
 */
module.exports = {
    alert: function (options) {
        var param = $.extend({
            container: 'body',
            obj: "#message",
            text: '',
            timeout: 3000,
            status: true,
            callback: null
        }, options);

        // 判断传入的是id还是class
        var callerStyle = param.obj.charAt(0) === '#' ? 'id' : 'class';
        //初始化jQuery对象
        var obj = $(param.obj).length === 0 ? $('<div ' + callerStyle + '="' + param.obj.slice(1) + '" />').appendTo('body') : $(param.obj);
        //判断状态
        var status = '';
        if (param.status === 0) {
            status = 'warn'
        } else if (param.status === 1) {
            status = 'tip'
        } else if (param.status === 2) {
            status = 'danger'
        } else if (param.status === 3) {
            status = 'success'
        }
        //自定义位置id标识
        // var id = new Date().getTime();

        clearTimeout(obj.data('count'));

        obj.html('<div class="c-message c-message-' + status + '"><span class="text">' + param.text + '</span></div>').removeClass('hide');

        // 计时器隐藏提示
        obj.data('count', setTimeout(function () {

            obj.addClass('hide');

            if (param.callback) {
                param.callback();
            }

        }, param.timeout));

    }
};
