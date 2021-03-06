# 设置url中search部分参数

> 做移动H5页面，运行在微信中，横屏的时候弹出一个提示框提示用户竖屏。在竖屏切换成横屏的时候发现页面右半部白的，有一定响应时间才会横过来触发onresize事件。
为了优化这个体验，每次进入页面检测是否横屏，是的话显示提示框，否的话正常流程。
监听onresize事件，每次横竖切换隐藏页面元素并刷新页面location.reload()。
然后在我的安卓手机上发现，每次横竖切换微信webview只是在顶部有页面加载的进度条效果，但是页面还是原来的页面。我写了个测试代码，在页面某部分显示数字0，没过一秒+1。
结果如同我的猜测，每次横竖切换，这个数字一直在增加，没有重置为0。
我猜是因为url没变，微信webview每次并没有重新加载url，只是给了个顶部进度条的效果。
于是我在onresize事件中location.href设置为更新了时间戳的url，ok了。如下：
```javascript
    window.onresize = function () {
        console.log('resize', window.orientation);
        containerEl.style.display = 'none';
        var newHref = util.setUrlParam('_t',+new Date());
        console.log(newHref);
        location.href = newHref
    };
    function checkResize() {
        if (window.orientation == 180 || window.orientation == 0) {
            maskTopEl.style.display = 'none';
        }
        if (window.orientation == 90 || window.orientation == -90) {
            maskTopEl.style.display = 'block';
        }
    }
    checkResize();
```
有这样的一种场景，页面跳转，但只需要更改url中search部分的某个参数
例如 http://a.tet.com?a=1#view 跳转到 http://a.test.com?a=2#view
或者追加一个参数时间戳
例如 http://a.tet.com?a=1#view 跳转到 http://a.tet.com?a=1&_t=1491993582491#view
setUrlSearchParam就是为类似这种问题准备的