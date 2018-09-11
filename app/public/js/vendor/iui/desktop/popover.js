var template = '<div class="IUI-popover-container">{{header}}{{content}}</div>';

var defaults = {
    handle: '[data-popover]', //绑定监听对象
    container: 'body', //全局作用域
    direction: 'down-center',
    compiler: null, //有无模板引擎
    header: '' //标题
};

// matrix : 
// 0 => 参照物x,
// 1 => 参照物y,
// 2 => 参照物w,
// 3 => 参照物h,
// 4 => 模板w,
// 5 => 模板h,
// 6 => 作用域元素x,
// 7 => 作用域元素y
// 8 => scrollTop
var tplDir = {
    left: function(matrix) {
        return matrix[0] - matrix[4] - matrix[6] - 20;
    },
    right: function(matrix) {
        return matrix[0] + matrix[2] * 2 - matrix[6] + 20;
    },
    up: function(matrix) {
        return matrix[1] - matrix[5] - matrix[7] - 20;
    },
    down: function(matrix) {
        return matrix[1] + matrix[3]  - matrix[7] + 20;
    }
};

var arrowDir = {
    left: function(matrix) {
        return matrix[0]  - matrix[6];
    },
    right: function(matrix) {
        return matrix[0] + matrix[2]*2 - matrix[4]  - matrix[6];
    },
    center: function(matrix) {
        return matrix[0] + matrix[2] - (matrix[4]/2)  - matrix[6];
    },
    top: function(matrix) {
         return matrix[1] - matrix[7];
    },
    bottom: function(matrix) {
        return matrix[1] + matrix[3] - matrix[5] - matrix[7];
    },
    middle: function(matrix) {
        return matrix[1]+ (matrix[3]/2) - (matrix[5]/2) - matrix[7];
    }
};

function Popover(config) {
    this.$selector = $(config.handle);
    this.$container = $(config.container);
    this.config = config;
    this.ctxPos = $(config.container)[0].getBoundingClientRect();
    this.screenWidth = $(document).width();
    this.screenHeight = $(document).height();
    this.init();
}

Popover.prototype.init = function() {
    var self = this;

    // show
    self.$container.on('click.IUI-popover', self.config.handle, function(event) {
        var $this = $(this);
        var eventSpace = $this.data('popoverid') ? ('.popover-' + $this.data('popoverid')) : '.popover';

        if ($this.hasClass('popover-active')) {
            self.hide($this.removeClass('popover-active').data('template'));
            return false;
        } else {
            $this.addClass('popover-active');
        }

        $.pub('before' + eventSpace, [self, $this]);
        $('body').trigger('click.IUI-popover');
        self.show($this);
        $.pub('after' + eventSpace, [self, $this]);
        event.stopPropagation();
    });

    // hide
    $('body').on('click.IUI-popover', function(event) {
        var $this = $(this);
        if (($(event.target).closest('.IUI-popover-container').length === 0)) {
            $this.trigger('hide.popover', [self]);
            self.hide();
        }
    });

};

// 获取调用者的位置
Popover.prototype.getEmitterPos = function(emitter) {
    var $emitter = emitter;
    var pos = $emitter[0].getBoundingClientRect();
    var emitterPosX = pos.left;
    var emitterPosY = pos.top;
    var emitterWidth = $emitter.outerWidth() / 2;
    var emitterHeight = $emitter.outerHeight();
    return [emitterPosX, emitterPosY, emitterWidth, emitterHeight];
};

// 填充内容
Popover.prototype.fillContent = function(emitter) {
    var self = this;
    var config = self.config;
    var $emitter = emitter;
    var header = $emitter.attr('data-ppHeader') || config.header;
    var str = $emitter.attr('data-popover');
    var isEl = str.indexOf('##') === 0;
    var $content = isEl ? str.slice(2, str.length) : $(str);

    var _template = template.replace('{{header}}', header ? '<div class="popover-header">' + header + '</div>' : '');

    if (!isEl && emitter.data('data') && config.compiler) {
        _template = _template.replace('{{content}}', config.compiler($content.html(), $emitter));
    } else {
        _template = _template.replace('{{content}}', isEl ? '<div class="popover-content">' + $content + '</div>' : $content.html());
    }

    return _template;

};


Popover.prototype.excePosition = function(emitter, template) {
    var self = this;
    // 外围容器坐标 x,y
    var ctxPosX = self.ctxPos.left;
    var ctxPosY = self.ctxPos.top;
    // 当前视窗宽高 w,h
    var screenWidth = self.screenWidth;
    var screenHeight = self.screenHeight + self.$container.scrollTop();
    // 参照物的坐标集
    var emitterMatrix = self.getEmitterPos(emitter);
    // 模板
    var $template = template;
    var tmpWidth = $template.outerWidth();
    var tmpHeight = $template.outerHeight();
    var position = [];
    var dirName = emitter.attr('data-ppDirect') || self.config.direction;
    var customDir = dirName.split('-');
    var index = 'left right'.indexOf(customDir[0]) !== -1 ? 0 : 1;
    var matrix = emitterMatrix.concat([tmpWidth, tmpHeight, ctxPosX, ctxPosY]);

    position[index] = tplDir[customDir[0]](matrix);
    position[index ? 0 : 1] = arrowDir[customDir[1]](matrix);
    position[2] = dirName;
    return position;
};


Popover.prototype.show = function(emitter) {
    var self = this;
    var config = self.config;
    var $emitter = emitter;
    var content = self.fillContent($emitter);
    var $template = $(content);
    var $body = $('body');
    var position;
    $emitter.data('template', $template);
    self.$container.data('popoverInit', self.$container.css('position')).css({ 'position': 'relative' });
    $template.addClass('popover-show').appendTo(config.container);
    position = self.excePosition(emitter, $template);
    $template.css({
        'left': position[0] + self.$container.scrollLeft() + $body.scrollLeft(),
        'top': position[1] + self.$container.scrollTop() + $body.scrollTop()
    }).addClass('popover-in '+position[2]);

};

Popover.prototype.hide = function(target) {
    var self = this;
    var $target = target || $('.IUI-popover-container');
    var $container = self.$container;

    if (!target) {
        $('[data-popover]').removeClass('popover-active');
    }

    $container.css('position', $container.data('popoverInit'));

    IUI_UTILS.transitionEndShim($target.removeClass('popover-in'), function() {
        $target.remove();
    });

};

module.exports = {
    popover: function(config) {
        return new Popover($.extend({}, defaults, config));
    }
};
