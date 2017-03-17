document.addEventListener('touchstart', function () {
    return false;
}, true);
(function (jQuery) {
    /*
    单选框、复选框、开关
    */
    var count = 0;
    $.fn.checkBox = function (set) {
        var defaults = {
            check: false,
            size: null,
            Init: null,
            theme: "defaults", //radius、radius-1
            type: "defaults",
            checkFn: null
        };
        var check = false;
        var hasAll = false;
        var elements = this;
        set = $.extend(defaults, set);
        return this.each(function () {
            count++;
            var $_this = $(this);
            var theme = set.theme;
            var html = null,
                size = null;
            switch (set.theme) {
                case "radius":
                    theme = "c-radius";
                    break;
                case "radius-1":
                    theme = "c-radius-1";
                    break;
                default:
                    theme = null;
                    break;
            }
            if (set.type == "switch") {
                theme = "c-radius-1";
                $_this.wrap('<div class="c-switch"></div>');

            } else {
                $_this.wrap('<div class="c-box"></div>');
            }
            if (theme) {
                html = '<label class="' + theme + '" for="c-' + count + '"></label>';
            } else {
                html = '<label for="c-' + count + '"></label>';
            }
            $_this.prop("id", "c-" + count);
            if ($_this.data("type") == "c-all") {
                $_this.after(html).addClass("_c_input_all");
                hasAll = true;
            } else if ($_this.data("type") == "") {} else {
                $_this.after(html).addClass("_c_input");
            }
            if ($_this.data("text")) {
                $_this.parent().append("<p>" + $_this.data("text") + "</p>");
            }
            if ($_this.is(":checked") && set.Init) {
                set.Init.call(this, check);
            }
            $_this.on("change", function () {
                if ($(this).is(":checked")) {
                    check = true;
                } else {
                    check = false;
                }

                if (hasAll) {
                    $("._c_input_all").prop("checked", true);
                }
                elements.each(function () {
                    var _input = $(this);
                    if (!_input.is(":checked") && _input.data("type") != "c-all") {
                        $("._c_input_all").prop("checked", false);
                    }
                });
                if ($(this).data("type") == "c-all") {
                    $("._c_input,._c_input_all").prop("checked", check);
                }
                if (set.checkFn) {
                    set.checkFn.call(this, check);
                }
            });
        });
    };
    var loads = {
        text: "loading...",
        layout: "line",
        checkFn: null,
        state:0,
        size:50
    }
    var layout = null;
    var loadInset = '<div class="load-box-inset"><div class="load-left"></div><div class="load-right"></div></div>';
    $.fn.load = function (set) {
        loads.text = "loading...";
        var elements = this;
        set = $.extend(loads, set);
        return this.each(function () {
            switch (set.layout) {
                case "line":
                    layout = "loading-line";
                    break;
                case "box":
                    layout = "loading-bg";
                    break;
                default:
                    layout = "loading";
                    break;
            }
            var $_this = $(this);
            var $_loadObj = $_this.parent().find("." + layout);
            if ($_loadObj.length <= 0) {

                $_this.after('<div class="c-load ' + layout + '">' + loadInset + '<p>' + set.text + '</p></div>');

            } else {
                if ($_loadObj.children().is("button.load-refresh-btn")) {
                    $_loadObj.find("button.load-refresh-btn").remove();
                }
                if ($_loadObj.find(".load-box-inset").length <= 0) {
                    $_loadObj.prepend(loadInset).find("p").text(set.text);
                }
            }
        });
    };

    //载入结束
    $.fn.loadend = function (set,callBack) {
        loads.text = "loadend";
        loads.state=1;
        set = $.extend(loads, set);
        return this.each(function () {
            var $_this = $(this);
            var $_loadObj = $_this.parent().find("." + layout);
            if ($_loadObj.children().is("button.load-refresh-btn")) {
                $_loadObj.find("button.load-refresh-btn").remove();
            }
            $_loadObj.find(".load-box-inset").remove();
            $_loadObj.find("p").text(set.text);
            if(callBack){
                callBack.call(this,loads.state);
            }
        });
    };
    //载入失败
    $.fn.loadfail = function (set) {
        loads.text = "loadfail";
        loads.checkFn = null;
        set = $.extend(loads, set);
        return this.each(function () {
            var $_this = $(this);
            var $_loadObj = $_this.parent().find("." + layout);
            $_loadObj.find(".load-box-inset").remove();
            $_loadObj.prepend('<button class="load-refresh-btn"></button>');
            $_loadObj.children("p").text(set.text);
            $(".c-load").on("click","button", set.checkFn);
        });
    };
    $.fn.loadclose = function (set) {
            set = $.extend(loads, set);
            return this.each(function () {
                var $_this = $(this);
                var $_loadObj = $_this.parent().find("." + layout);
                if (set.checkFn) {
                    set.checkFn.call(this);
                }
                $_loadObj.remove();
            });
        }
        /*
               centerImg-
               -2017-01-28 17:47:37
               -CODE0243
               -Version：1.0.0
               */

    $.fn.centerImg = function (set) {
        var defaults = {
            load: null, //载入回调事件
            style: "full", //排版样式
            scale: "4:3", //图片显示比例
        };
        var set = $.extend(defaults, set);
        var elements = this;
        var _index = 0;
        var $_this = null;
        var $_obj = null;
        var time;
        var $_win = $(window);
        var $_imgBox = null;
        $(window).on("resize", function () {
            clearTimeout(time);
            time = setTimeout(imgMath, 500);
        });
        imgMath();
        return this.each(function () {
            $_this = $(this);
            $_this.one("load", loadImg);
            //hezi
        });

        function imgMath() {
            //boxScale();
            elements.each(function () {
                console.log(this.height + "--" + this.width);
                var scale = set.scale;
                var _width = $(this).parent().width();
                var _height = $(this).parent().height();
                scale = scale.split(":");
                var _height = (_width * scale[1]) / scale[0];
                $(this).parent().height(Math.ceil(_height));
                if ($(this).width() < _width && $(this).width() != $(this).height()) {
                    //$(this).css(imgStyle("y"));
                } else if ($(this).height() < _height && $(this).width() != $(this).height()) {
                    //$(this).css(imgStyle("x"));
                }
            });
        }

        function loadImg() {
            var n = 10; //容差
            var this_w = (n / 100) * this.width //计算图片宽度的百分比
            var this_h = (n / 100) * this.height //计算图片高度的百分比
            switch (set.style) {
                case "auto":
                    //自动不会剪切图片
                    if (this_h > this_w) {
                        $(this).css(imgStyle("x"));
                    } else if (this_w > this_h) {
                        $(this).css(imgStyle("y"));
                    }
                    break;
                case "full":
                    //铺满注：该属性会把图片剪切
                    if (this_h > this_w) {
                        $(this).css(imgStyle("y"));
                    } else if (this_w > this_h) {
                        $(this).css(imgStyle("x"));
                    }
                    break;
                default:
                    if (this_h > this_w) {
                        $(this).css(imgStyle("x"));
                    } else if (this_w > this_h) {
                        $(this).css(imgStyle("y"));
                    }
                    break;
            }
            if (set.load) {
                set.load.call(this);
            }
        }

        function imgStyle(v) {
            if (v == "y") {
                v = {
                    "width": "100%",
                    "max-width": "none",
                    "height": "auto",
                    "top": "50%",
                    "left": "auto",
                    "position": "absolute",
                    "transform": "translateY(-50%)",
                    "-wekit-transform": "translateY(-50%)",
                    "-moz-transform": "translateY(-50%)",
                    "-ms-transform": "translateY(-50%)",
                    "-o-transform": "translateY(-50%)",
                };
            } else if (v == "x") {
                v = {
                    "width": "auto",
                    "max-width": "none",
                    "height": "100%",
                    "top": "auto",
                    "left": "50%",
                    "position": "absolute",
                    "transform": "translateX(-50%)",
                    "-wekit-transform": "translateX(-50%)",
                    "-moz-transform": "translateX(-50%)",
                    "-ms-transform": "translateX(-50%)",
                    "-o-transform": "translateX(-50%)",
                };
            } else {
                v = {
                    width: "auto",
                    height: "auto",
                    margin: "auto"
                }
            }
            return v;
        }
    };
})(jQuery);
function rmoney(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10) cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}