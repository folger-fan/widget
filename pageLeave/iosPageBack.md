# 判断ios页面回退
## 背景
微信ios部分系统上页面A跳转到页面B，再回退到A，A没有刷新，还是离开前的状态。这时候可能会产生意料外的问题。
## 思路
window有onpageshow事件，事先定义一个标识showed=false，在onpageshow事件中设为true，页面从B回退到A的时候会再次触发onpageshow事件，这时候判断showed为true，则表明是回退过来的,这时候可以做一些处理。<br/>
从微信切到其他程序，再切回来onpageshow不会触发
代码如下：
```
let showed = false;
window.onpageshow = function () {
    if (showed && iOsVer < 9) {
        location.reload()
    }
    showed = true;
};
```
