# 浏览器缩放下页面自适应

## 利用rem做页面自适应
rem是相对于根元素`html`的尺寸单位

设计师以一个固定宽度给出设计图，开发者根据这个固定宽度和屏幕宽度为html设置字体像素大小。其他元素用rem做字体单位，则可以看作是不同尺寸屏幕下各元素相对整个屏幕宽度的比例固定，网上有[详细介绍](http://caibaojian.com/web-app-rem.html)

我们的代码是

```
var docEl = doc.documentElement;
var width = docEl.clientWidth;
var fs = 100 * (width / 750);
docEl.style.fontSize = fs + 'px';
```

## 浏览器缩放后的自适应

但是在浏览器缩放后，正常情况下页面各元素也会跟着缩放，但屏幕宽度不变，就会有布局混乱的问题

在微信中如

页面字体标准

![标准](https://p.qpic.cn/wyp_pic/duc2TvpEgSTLM4dYAHFZhU2G8Eh5Ggt5XdKgkxQe45tLonMnmCdYmlxsVkPiaa7gh/364)

页面字体放大，布局混乱

![放大异常](https://p.qpic.cn/wyp_pic/duc2TvpEgSQFhSSBSKusicJdBicxRaZxhKAF2UAVJQ8QUj5ouFNxq3KSTX8DNI6gC2/364)

在网上查找资料，http://www.cnblogs.com/Man-Dream-Necessary/p/5939001.html
给出了在iOS上通过css 禁止微信调整字体大小
```
body { /* IOS禁止微信调整字体大小 */
    -webkit-text-size-adjust: 100% !important;
}
```
实验了ok。

这篇文章给出的安卓下的处理方案，经实验，我的安卓将字体调到最大，进入页面，布局错乱，经过大约一秒中后恢复正常。字体调整到正常大小，没有闪动现象。这种页面闪动的体验不太好，需要体验更好的解决方案，网上大概搜了下，没搜到合适的。遂只能自己尝试解决。

经多次实验后发现，假如给document设置字体大小50px，正常情况下，其字体的像素大小是50px，可以通过
`window.getComputedStyle(
                    document.documentElement).fontSize`
查到

页面缩放后，元素的真实字体像素大小发生了变化

接着最上面给出的代码，判断document字体真实像素大小和原设置的大小，再进行一次缩放，就可以解决了。

```
var rfs = window.getComputedStyle(
                    document.documentElement).fontSize.replace('px', '');
if (rfs !== fs) {
    fs = fs * (fs / rfs);
    docEl.style.fontSize = fs + 'px';
}
```
效果如图

![放大ok](https://p.qpic.cn/wyp_pic/duc2TvpEgSRtuYJvgLNfynk1ia0ZaNGOxVwnTpicwZ0mXzFuwU1byajhDia7A70PYme/364)

经实验，在PC谷歌浏览器、火狐浏览器，缩放页面，页面不会发生异常。在我的安卓微信下，页面缩放后，页面会异常，但刷新浏览器就ok了。

这里是[样例代码](http://atest.yk.qq.com/static/folger/test/index.html)