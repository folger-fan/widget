# 检查html节点中文本是否是缩略

有这样的一个场景:展示简介，超过三行缩略显示，下方有一个按钮，点击按钮展示所有的，不超过三行不用缩略显示也不用显示下方的切换按钮。

限制文本行数，可以用css属性
```
.multi-line-ell-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
```

如何判断文本是否缩略了？如果针对特定机型的页面，可以尝试判断字数，但机型不同，一行所能展示的字数可能不一样的，这个办法行不通。

经过尝试发现，将节点wrapper文本内容用span包裹，缩略有效，被隐藏的span的top会大于等于节点wrapper的bottom。如图

![图片](https://p.qpic.cn/wyp_pic/duc2TvpEgSQic1bTK3W7QPEA4AHxQXsTRYqmNV1ISLE0yOXbkibyAebFKSLtqdoOxF/0)

根据这个原理可以判断节点的文本是否是缩略的

见[demo](https://github.com/folger-fan/widget/blob/master/isContentBrief/demo.html)

js代码如下:

```
function isContentBrief(wrapperP) {
    let childNodes = wrapperP.childNodes;
    if (wrapperP.childNodes.length !== 1 || wrapperP.childNodes[0].nodeName !== '#text') {
        throw new Error('父节点内容不是纯文字')
    }
    var content = wrapperP.innerHTML.replace(/^\s+/, '').replace(/\s+$/, '');
    var contentArr = [];
    for (var i = 0; i < content.length; i++) {
        contentArr.push('<span>' + content[i] + '</span>')
    }
    wrapperP.innerHTML = contentArr.join('');
    var lastSpan = childNodes[childNodes.length - 1];
    var result = lastSpan.offsetTop >= wrapperP.offsetTop + wrapperP.offsetHeight;
    wrapperP.innerHTML = content;
    return result;
}
```