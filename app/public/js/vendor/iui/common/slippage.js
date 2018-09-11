/**
 * version 1.0.0
 * 支持垂直和水平翻转
 * 支持鼠标和手势
 * 不兼容 IE9-
 */

/**
 * next version
 * 超长内容模拟滚动
 * 可配置对象
 * 每屏内容动画控制
 */

let utils = require('../utils');

let defaults = {
    wrapper: '#selector',
    mouseDrag: true,
    touchDrag: true,
    direction: 0
};

let normalStyle = {
    '-webkit-transform-origin': 'center top 0px',
    '-webkit-transform': 'scale(1)',
    '-webkit-transition': 'none',
    'transform-origin': 'center top 0px',
    'transform': 'scale(1)',
    'transition': 'none'
};





function getPage(event) {
    let offset = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
    return [offset.pageX, offset.pageY];
}

function Slippage(options) {
    let self = this;
    self.config = $.extend({}, defaults, options);
    self.$el = $(self.config.wrapper);
    statusInit.call(self);
    this.init(options);
}

Slippage.prototype.init = function(options) {
    let self = this;
    if (self.$el.children().length === 0) {
        return false;
    }
    self.$userItems       = self.$el.children();
    self.itemsAmount      = self.$userItems.length;
    self.wrapItems();
    self.$slippageItems   = self.$el.find('.slippage-item');
    self.$slippageWrapper = self.$el.find('.slippage-wrapper');
    self.$slippageItems.eq(0).css(normalStyle).addClass('z-current');
    self.$slippageItems.find('.slippage-content').scrollTop(1);
    self.eventTypes();
    self.gestures();
    console.log(self);

};



function statusInit() {
    var self           = this;
    self.animateStart  = self.pageIndex = self.prevIndex = self.nextIndex = self.arrow = self.pageHeight = 0;
}

function statusStart() {
    let self           = this;
    let amount         = self.itemsAmount;
    let prevIndex      = self.pageIndex - 1;
    let nextIndex      = self.pageIndex + 1;

    self.animateStart  = 1;
    self.prevIndex     = prevIndex < 0 ? (amount - prevIndex - 2) : prevIndex;
    self.nextIndex     = nextIndex < amount ? nextIndex : 0;
    self.pageHeight    = self.$slippageItems.eq(0)[self.config.direction ? 'outerHeight' : 'outerWidth']();
}

function statusMove(direction) {
    let self           = this;
    self.pageHeight    = direction ? Math.abs(self.pageHeight) : (self.pageHeight > 0 ? (-self.pageHeight) : self.pageHeight);
    self.animateTarget = direction ? self.nextIndex : self.prevIndex;
    self.animateStart  = 2;    
}

function statusUndo(){
    let amount         = self.itemsAmount;
    let prevIndex      = self.pageIndex + 1;
    let nextIndex      = self.pageIndex - 1;
    self.animateStart  = 0;
    self.prevIndex     = prevIndex < amount ? prevIndex : 0;
    self.nextIndex     = nextIndex < 0 ? (amount - nextIndex - 2) : nextIndex;
}


Slippage.prototype.gestures = function() {
    let self = this;
    let transition = self.config.direction ? 'translateY' : 'translateX';

    function swapEvents(type) {
        if (type === 'on') {
            $(document).on(self.eventType.move, dragMove);
            $(document).on(self.eventType.end, dragEnd);
        } else if (type === 'off') {
            $(document).off(self.eventType.move);
            $(document).off(self.eventType.end);
        }
    }

    function dragStart(event) {
        console.log(self.animateStart);
        if (self.animateStart) {
            return false;
        }
        let $this      = self.$eventTarget = $(this);
        self.mouseInit = getPage(event)[self.config.direction];
        swapEvents('on');
        $this.css(normalStyle);
        statusStart.call(self);
        return false;

    }

    function dragMove(event) {

        let arrows       = getPage(event)[self.config.direction];
        let offset       = arrows - self.mouseInit;
        let $next        = self.$slippageItems.eq(self.nextIndex);
        let $prev        = self.$slippageItems.eq(self.prevIndex);
        let direction    = arrows < self.mouseInit;
        let $scrollEl    = self.$eventTarget.find('.slippage-content');
        let scrollAmount = $scrollEl.length ? $scrollEl[0].scrollHeight - $scrollEl[0].offsetHeight : 0;

        self.$slippageItems.removeClass('z-active');
        self.arrow = arrows;
        statusMove.call(self,direction,event);
        self.$slippageItems.eq(self.animateTarget).addClass('z-active');
        self.$slippageItems
            .eq(self.animateTarget)
            .css({
                '-webkit-transition': 'none',
                'transition': 'none',
                '-webkit-transform': transition + '(' + (self.pageHeight + offset) + 'px)',
                'transform': transition + '(' + (self.pageHeight + offset) + 'px)'
            });
        // if($scrollEl.length && $scrollEl.scrollTop() >= scrollAmount && !direction){
        //     console.log(1111111111111);
        //     statusUndo.call(self);
        //     $scrollEl.scrollTop($scrollEl.scrollTop()-5);
        //     swapEvents('off');
        // }else if($scrollEl.length && $scrollEl.scrollTop() <= 0 && direction){
        //     console.log(22222222222222);
        //     $scrollEl.scrollTop(5)
        //     statusUndo.call(self);
        //     swapEvents('off');
        // }else{
        //     console.log(33333333333333);
        //     self.arrow = arrows;
        //     statusMove.call(self,direction,event);
        //     self.$slippageItems.eq(self.animateTarget).addClass('z-active');
        //     self.$slippageItems
        //         .eq(self.animateTarget)
        //         .css({
        //             '-webkit-transition': 'none',
        //             'transition': 'none',
        //             '-webkit-transform': transition + '(' + (self.pageHeight + offset) + 'px)',
        //             'transform': transition + '(' + (self.pageHeight + offset) + 'px)'
        //         });
        // }

    }

    function dragEnd(event) {

        if (self.animateStart === 1) {
            self.animateStart = 0;
            swapEvents('off');
            return false;
        }

        let rollback      = Math.abs(self.arrow - self.mouseInit) < 300;
        let offsetEnd     = rollback ? self.pageHeight + 'px' : '0px';
        let direction     = self.arrow < self.mouseInit;
        let $scrollEl     = self.$eventTarget.find('.slippage-content');

        if (rollback) {
            self.animateStart = self.pageHeight = 0;
        } else {
            self.pageIndex    = self.animateTarget;
            self.$slippageItems.eq(self.animateTarget).addClass('z-current');
        }

        $scrollEl.scrollTop($scrollEl.length && $scrollEl[0].scrollTop ? $scrollEl[0].scrollTop - 1 : 1);

        self.$slippageItems
            .eq(self.animateTarget)
            .css({
                '-webkit-transition': '-webkit-transform .4s linear',
                'transition': 'transform .4s linear',
                '-webkit-transform': transition + '(' + offsetEnd + ')',
                'transform': transition + '(' + offsetEnd + ')'
            });

        self.$slippageItems
            .eq(self.animateTarget)
            .off(utils.transitionEnd)
            .on(utils.transitionEnd, function(event) {
                $(this).removeClass('z-active');
                if (rollback) {
                    self.$eventTarget.addClass('z-current');
                } else {
                    self.$eventTarget.removeClass('z-current');
                }
                self.$eventTarget.css(normalStyle);
                self.animateStart = 0;
            });

        swapEvents('off');
    }


    self.$el.on(self.eventType.start, '.slippage-item', dragStart);

    // self.$el.on(self.eventType.start, '.slippage-content', function(event) {

    //     let scrollAmount = this.scrollHeight - this.offsetHeight;

    //     if (this.scrollTop > 0 && this.scrollTop < scrollAmount) {
    //         self.animateStart = 0;
    //         event.stopPropagation();
    //     }


    // });

};

Slippage.prototype.wrapItems = function() {
    let self = this;
    self.$userItems.wrapAll('<div class="slippage-wrapper">').wrap('<div class="slippage-item"></div>');
    self.$el.css('display', 'block');
};

Slippage.prototype.eventTypes = function() {
    let self = this,
        types = ['s', 'e', 'x'];

    self.eventType = {};

    if (self.config.mouseDrag === true && self.config.touchDrag === true) {
        types = [
            'touchstart.slippage mousedown.slippage',
            'touchmove.slippage mousemove.slippage',
            'touchend.slippage touchcancel.slippage mouseup.slippage'
        ];
    } else if (self.config.mouseDrag === false && self.config.touchDrag === true) {
        types = [
            'touchstart.slippage',
            'touchmove.slippage',
            'touchend.slippage touchcancel.slippage'
        ];
    } else if (self.config.mouseDrag === true && self.config.touchDrag === false) {
        types = [
            'mousedown.slippage',
            'mousemove.slippage',
            'mouseup.slippage'
        ];
    }

    self.eventType.start = types[0];
    self.eventType.move = types[1];
    self.eventType.end = types[2];
};


module.exports = {
    slippage: function(options) {
        return new Slippage(options);
    }
};
