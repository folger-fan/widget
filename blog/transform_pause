## 需求背景
产品想做一个视频弹幕的H5页面，视频暂停后弹幕跟着暂停，视频继续播放后弹幕跟着从暂停时位置继续播放

## 实现方案
研究了下A站里面的弹幕，应该是用flash实现的。此外还可以用canvas实时画或js实时控制。

flash和canvas不太熟，js做动画性能不好。我想到的比较容易实现的方案是用css3的animation，查资料发现animation-play-state可控制animation动画暂停。

定好用css3的animation来实现弹幕滚动和暂停的方案后开始写代码。写完发现，在安卓机上ok，在ios上不行，上网查了下animation-play-state在ios不起作用。

animation不行就考虑用transition结合transform实现。

思路是：

1. 开始动画时记录时间
2. 暂停的时候记录transform属性值，记录暂停时间结合动画开始时间计算已经动画的时间
3. 动画重新开始时，设置动画持续时间为总的动画时间减去已经动画的时间



### 代码如下
[点击查看demo](https://static.yk.qq.com/tyopen/site/index.e9fd09.html)
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover">
    <title>Title</title>
    <style>
        .dan-mu-item {
            position: absolute;
            left: 0;
            top: 100px;
            text-align: left;
            word-break: keep-all;
            transform: translate3d(100vw, 0, 0);
            transition: transform 5s linear;
        }
    </style>
</head>
<body>
<div class="dan-mu-item">弹幕test</div>
<button id="startBtn">开始</button>
<button id="pauseBtn">暂停</button>
<script src="jquery.min.js"></script>
<script>
    $(function () {
        let $start = $('#startBtn'), $pause = $('#pauseBtn'), $dan = $('.dan-mu-item'), duration = 5000,
            started = false;
        $start.click(function () {
            if ($dan.data('state') === 'pause') {//restart
                let showed_time = Number($dan.data('showed_time'));//计算动画剩余时间
                $dan.css({
                    transition: `transform ${(duration - showed_time) / 1000}s linear`
                }).data('state', 'show');
                setTimeout(function () {
                    $dan.css({
                        'transform': 'translate3d(-100%, 0, 0)'
                    }).data('start_time', +new Date());
                })
            } else if (!started) {//start
                started = true;
                $dan.css({
                    transform: 'translate3d(-100%, 0, 0)'
                })
                    .data('start_time', +new Date())//记录此次动画起始时间，方便下次暂停时计算已动画时间
                    .data('showed_time', 0);
            }
        });
        $pause.click(function () {//pause
            let now = +new Date(), start_time = Number($dan.data('start_time')),
                showed_time = Number($dan.data('showed_time'));
            if ($dan.data('state') === 'pause') {
                return
            }
            showed_time += now - start_time;
            $dan.css({
                transition: 'none',
                'transform': $dan.css('transform')//记录暂停时transform属性值
            }).data('showed_time', showed_time).data('state', 'pause');
        })
    })

</script>
</body>
</html>
```
