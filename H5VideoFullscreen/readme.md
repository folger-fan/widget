
# H5横屏时视频全屏播放的IPhone&Android解决方案
> 移动H5的坑都是一点点尝试填起来的

## IPhone视频播放不自动全屏

IPhone下点视频播放会自动全屏。在video标签上加上 playsinline webkit-playsinline这两个属性即可，如：
````
<video id="video" playsinline webkit-playsinline style="width:100%" controls
       src="http://bikansvideo-30040.sz.gfp.tencent-cloud.com/source_5/videos/0607/13890607/av13890607.mp4"></video>
````
> 发现安卓微信中非QQ域名下播放视频会自动全屏，没找到解决方案。

## 视频播放时，横屏自动全屏
在视频播放时，横屏后不作处理，可能会有部分被遮挡住。横屏后如果视频全屏，则体验更好。
网上查到有[全屏api](http://www.cnblogs.com/kingwell/p/3706352.html)，试了下安卓可用，但 IPhone 不可用。
IPhone下一开始的方案是想做一个浮层，让video铺满整个屏幕，但在用IPhone调试时候发现左右会留白，不尽如人意。
几经尝试，最后想法还是回到了之前设置的playsinline属性上，在横屏时候移除playsinline属性，但发现还是不行。想到一开始IPhone下点击播放，如果没有 playsinline 属性的话会自动全屏，那么在播放状态下横屏时候在移除 playsinline 的同时暂停再播放是否可行，实验了一次居然可行。

代码如下：
```
<body>
<video id="video" playsinline webkit-playsinline style="width:100%" controls
       src="http://bikansvideo-30040.sz.gfp.tencent-cloud.com/source_5/videos/0607/13890607/av13890607.mp4"></video>
<script>
    var player = document.getElementById('video');
    var ua = window.navigator.userAgent.toUpperCase();
    var ANDROID = ua.indexOf('ANDROID') !== -1;
    var IPHONE = ua.indexOf('IPHONE OS') !== -1;
    window.addEventListener('orientationchange', function () {
        var isHp = window.orientation === 90 || window.orientation === -90;
        if (isHp && !player.paused) {
            if (IPHONE) {
                player.removeAttribute('playsinline');
                player.removeAttribute('webkit-playsinline');
                player.pause();
                player.play();
            }
            if (ANDROID) {
                if (player['webkitRequestFullscreen']) {
                    player['webkitRequestFullscreen']()
                }
                if (player['requestFullscreen']) {
                    player['requestFullscreen']()
                }
            }

        }
        if (!isHp && IPHONE) {
            player.setAttribute('playsinline', true);
            player.setAttribute('webkit-playsinline', true);
        }
    }, false);
</script>
</body>
```