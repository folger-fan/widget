/**
 * Created by folgerfan on 2016/5/25.
 */
(function ($) {
    var $span = $('<span style="position:absolute;opacity:0;z-index:-1;"></span>');
    $.fn.inputWidthScale = function () {
        var $el = $(this);
        var minWidth = $el.width();
        $span.css({
            'font-size': $el.css('font-size'),
            'font-family': $el.css('font-family'),
            'font-weight': $el.css('font-weight')
        });
        $el.on('input', function () {
            var val = $el.val();
            $span.html(val).appendTo($('body'));
            var spW = $span.width();
            var newW = spW + 4;
            $el.width(newW > minWidth ? newW : minWidth);
            $span.remove();
        });

    }
})(window.jQuery || window.Zepto);