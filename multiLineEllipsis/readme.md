# 节点多行文本限定行数显示文本

碰到这样的需求：节点内最多显示两行文本，多余的用省略号表示。

百度了下，发现css可以设置节点单行文本缩略显示，但控制不了多行的。

> 同事发现了webkit下控制多行文本省略的css 2017-04-14
```css
        .multi-line-ell-base{
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }
        .multi-line-ell-2{
            -webkit-line-clamp: 2;
        }
```

没找到合适的解决方案只能撸起袖子自己干。折腾了快两天时间写了个工具方法。

首先，有些字符（如字母数字）的宽度只有汉字的一半，如果用判断字符集的方式判断每个文字会有多少宽度比较麻烦。
简单点的，我设置一个单独的div，给它设置字体样式，然后把目标文本迭代获取单个字符放进这个div中，用window.getComputedStyle获取这个字符占的宽度。
经过实验发现，数字不是很精确，总会比在目标节点中略宽一点，不过不影响效果。这就是getTextWidth方法。

迭代目标文本，放进tempArr中，lineWidth记录tempArr中所有字符所占宽度，判断lineWidth是否会大于限定的width，是的话换下一行。

如果到了限定行数，且lineWidth加上省略号的宽度再加上下个字符的宽度大于限定宽度，那么不再迭代。

可以在测试页面测试和看使用方法




