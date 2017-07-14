# 页面离开再回来的判断
## 背景
如 [判断ios页面回退](./iosPageBack.md) 所描述，一开始折腾出来的是这个方案，也解决了问题，后来发现window有onpageshow事件，便用onpageshow来解决了问题。<br/
不过当前这个方案适用范围更广
## 能力
chrome/firefox上打开页面A，切换到页面B，再切换到页面A（隔一秒），可以判断出离开过页面A<br/>
ios部分上能达到[判断ios页面回退](./iosPageBack.md)的效果<br/>
ios的微信、qq浏览器/safari切到其他程序再回来，可以判断离开<br/
我的vivo的微信、qq浏览器上，切换到其他程序，再切回微信，可以判断离开过页面A<br/>
我拿了三个ios手机测试，有的从A到B，再从B到A，有的页面是不刷新的有的是刷新的，有个ios判断离开不是很灵敏。安卓目前只拿了vivo实验。<br/>
如果碰到类似问题，可以结合iosPackBack和pageLeave综合处理。
## 原理
设置初始时间tb、迭代setInterval时间间隔step和计数器num，setInterval中num++。<br>
然后判断当前时间te - tb - num * step的差值dif，是否大于1秒(可自定义)
页面一直活跃的时候差值是很小的，如果页面切出去了但处于挂起状态的话，初始值有效但js进程会挂起setInterval不会执行<br/>
页面再次活跃js继续执行那么dif就可认为是页面离开的时间。

