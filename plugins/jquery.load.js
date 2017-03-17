(function ($) {
    function novaLoadFn(element, options) {
        this.element = element;
        this.defaults = {
            size: 50,
            border: 2,
            layout: null,//布局模式-box-
            modal: false//设置为模态窗口布局必须是"box"
        }; //参数
        this.version = 'v1.0.0';
        this.settings = $.extend({}, this.defaults, options);
        this.init();
    }
    novaLoadFn.prototype = {
        //初始化方法
        init: function () {
            var self = this;
            var $self = $(this);
            self.style(self);
        },
        style: function (self) {
            $(self.element).find(".nv-loop").css({
                width: self.settings.size + 'px',
                height: self.settings.size + 'px',
            });
            $(self.element).find(".nv-load-loop").css({
                width: self.settings.size - self.settings.border * 2 + 'px',
                height: self.settings.size - self.settings.border * 2 + 'px',
                borderWidth: self.settings.border + 'px'
            });
            //布局
            switch (self.settings.layout) {
                case "transverse":
                    $(self.element).addClass("nv-load-transverse");
                    break;
                case "box":

                    if (self.settings.modal) {
                        $(self.element).wrap('<div id="mask"></div>');
                    }
                    $(self.element).addClass("nv-load-box");
                    break;
                default:
                    $(self.element).css({
                        "display": "block"
                    });
                    break;
            }
        }
    };
    $.fn.novaLoad = function (options) {
        new novaLoadFn(this, options);
    };
})(jQuery);
