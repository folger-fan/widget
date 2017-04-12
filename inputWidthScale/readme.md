## input自动伸缩宽度

有种效果是:input输入框，随着输入内容的增加，输入框宽度跟着改变。

笔者先是在网上找了下，没看到这样的库，只能自己实现。

经过思考和实验，难点在于得到input输入框中内容的宽度。查了下文档，没看到input有这样的api。

不能直接得到input输入框中内容的宽度，那可不可以间接得到？将input内容放到一个隐藏的span中，获取span的宽度，然后反过来控制input的宽度。如：
```javascript
     var $span = $('<span style="position:absolute;opacity:0;z-index:-1;"></span>');
     $el.on('input',function(){
        var val = $el.val();
        $span.html(val).appendTo($('body'));
        var spW = $span.width();
        var newW = spW+4;
        $el.width(newW>minWidth?newW:minWidth);
        $span.remove();
     });
```
经过尝试，方法可行，不过span的宽度会过大。经过检查，发现span的字体跟input不一样，导致span的宽度不同于input中内容的宽度。做如下设置:
```javascript
$span.css({
        'font-size':$el.css('font-size'),
        'font-family':$el.css('font-family'),
        'font-weight':$el.css('font-weight')
    });
```