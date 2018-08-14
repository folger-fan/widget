完成基本的弹幕功能只需要两天，改却改了大半个月。这里不详解弹幕如何开发，想介绍的是一个产品需求的迭代过程，以及问题如何一步步解决的过程。
附线上页面
https://static.yk.qq.com/tyopen/h5/jd.html
https://static.yk.qq.com/tyopen/h5/aqgy.html


最开始要做小程序上的视频弹幕，弹幕初始内容写死的，用户发的弹幕只能自己看见。这个还好，不需要从后台拉数据同其他人交互。

弹幕的基本逻辑就是一行文字从右边飘到左边，复杂点的功能是随着视频播放，按时间取弹幕飘过。

小程序是状态驱动界面，相比直接用jquery操作节点，要绕一点，但也能写的出来。吭哧吭哧两天完成一个demo。

后面发现小程序中Video这种原生组件的动画性能不达标，上下翻页的时候忒卡。最后转成用H5做。从状态驱动界面变更，改成了jquery(这里不讨论移动端用jquery还是zepto)操作dom节点。弹幕基本逻辑差不多的，一两天时间改好。

产品要求视频弹幕随视频暂停和播放。一开始视频动画用的animation，animation-play-state属性可控制animation动画暂停，但在iOS中无效。后换成用transition动画，控制transform变化。弹幕开始动画的时候记录动画开始时间。视频暂停的时候，设置transform属性为当前transform值，用当前时间减去动画开始时间就是动画进行的时间，存到节点中。视频重新播放后，再次将当前时间记为动画开始时间。动画duration减去动画进行的时间就是剩下的动画需要进行的时间。这样就可以用transform做到弹幕的暂停和播放了。

产品想用户进入页面后wifi下自动播放。我实验了翻，发现必须得有用户交互后才能让视频自动播放。后面产品联系了其他部门的专做H5的同事，沟通后发现在iOS微信上可以通过监听WeixinJSBridgeReady事件，让视频播放，然后暂停。只要视频播放成功一次，后面就可以用程序在合适的时机让视频播放了。

    if (IOS && WX) {
            this.$video[0].onplay = () => {
                this.$video[0].pause();
                this.$video[0].onplay = null;
            };
            document.addEventListener("WeixinJSBridgeReady", () => {
                this.$video[0].play();
            }, false);
        }
        
安卓微信做不到自动播放，必须要用户点击页面后才能让视频播放。非wifi下也不能自动播放。那么在视频不播放的时候视频弹幕也出不来，这时候产品要求视频一开始不播放的时候弹幕区域内播放循环弹幕。循环弹幕播放的时候，用户发的弹幕在循环弹幕中，视频弹幕播放的时候，用户发的弹幕在视频弹幕中。

循环弹幕无非是从监听video的timeupdate改成setInterval，发弹幕区分是循环弹幕还是视频弹幕这个也还好。

此时我碰到的问题是，初始的弹幕库在H5投放后有可能会有改动。视频弹幕还好说，跟时间走嘛。但循环弹幕，是有顺序位置的。一开始我是将初始弹幕库和用户发送后的弹幕一起作为一个数组存在Localstorage的，初始弹幕库有变更，有可能边长，有可能变短。这让我怎么替换？我的解决方案是，初始弹幕写在代码中，循环弹幕用户发的内容同发送时候的在弹幕列表中的位置一起存在本地

    list.push({seq, text: comment});
    StorageUtil.localData(this.lsKey, list);
    
最后取的时候，相当于重放用户的操作，将用户发送的弹幕插进初始弹幕

    lsList.forEach(({text, seq}) => {
            this.danMuList.splice(seq, 0, new BaseAutoDanMu.Item(text, 'me'));
        })
        
同时要求产品更换初始弹幕库的时候只能增多不能减少。这样，不管初始弹幕库怎么变，用户发送的弹幕在弹幕列表中的位置都不会变了。

初始弹幕可替换的问题解决了，这时候来了最大的坑：弹幕不能重叠。

接到这个需求的时候，我的内心是极度抗拒的，在一些视频网站上弹幕都会有重叠，如果在某个时间点发的弹幕多了，哪能不重叠。

天大地大产品最大，产品的需求尽量满足，满足不了再PK。

对于在某个时间点发的弹幕过多，几个同事一起讨论出来的方案是，用户发送的视频弹幕，会顺延替换后面的初始弹幕。这样，总的弹幕数量和弹幕出现的时间点和频率都是可以控制的。然后我们尝试控制弹幕速度和弹幕频率来达到弹幕不重叠。产品和我一起调了一个晚上，总不尽如人意。弹幕会很快、很稀，而且时不时就会有弹幕重叠的，效果很不好。

没办法，只能使出大招了。要拉取下一个弹幕的时候，一个个航道判断，这个航道的是否有弹幕，有的话最后一个弹幕是否飘过了屏幕右边界。

先介绍下从iscroll源码中扣的计算节点 transform属性值的方法

    function getComputedPosition(el) {
        let matrix = window.getComputedStyle(el, null),
            x, y;
        matrix = matrix['transform'].split(')')[0].split(', ');
        x = +(matrix[12] || matrix[4]);
        y = +(matrix[13] || matrix[5]);
        return {x: x, y: y};
    }
    
有了这个方法，可以知道元素translateX值，然后获取节点宽度，就可以知道节点是否飘过了屏幕右边界。

    getAvailableLine() {
        let availableN = null;
        for (let i = 0; i < this.size; i++) {

            let seq = (this.n + 1 + i) % this.size;
            let n$el = this.lineLastMap[seq];
            if (!n$el) {//当前航道没有弹幕
                availableN = seq;
                break
            } else {
                let {x} = BaseDanMu.getComputedPosition(n$el[0]);
                if (!x) {//当前航道弹幕已移除
                    availableN = seq;
                    break
                }
                n$el.attr('data-x', x);
                if (x + n$el.width() < winW - 50) {//飘过了右边界50像素
                    availableN = seq;
                    break
                }
            }
        }
        return availableN
    }
    
解决了弹幕重叠的问题，产品希望能一点点调弹幕，以达到一个比较好的效果。产品提供的是一个excel文档，我这边解析输出成js代码。如果产品改点东西我解析下再给产品体验，我不用干别的了。从excel拷贝内容出来，这些内容是格式良好的，教产品如何将内容拷贝进Localstorage，页面代码从Localstorage取内容解析生成初始弹幕，产品刷新页面就可以查看调整后的效果。当然最后上线的是写进代码里的弹幕初始库。

要做的H5有两个，交给另外两个同事做，两个都要用到循环弹幕和视频弹幕。我将公共的代码抽离成一个基本弹幕类、基本循环弹幕类和基本视频弹幕类，两个H5各自继承基本类然后实现差异化的部分代码。这样不同的H5可以有自己的弹幕样式，弹幕逻辑有了问题要调整，我只需要调整基本类即可，对两个H5其他业务逻辑无影响。

总结下，先给产品点赞，我们产品对产品体验是精益求精的，这也推动我们技术的进步。技术实现碰到难度，先尽可能的想解决方案，最后再跟产品需求平衡。不是一味地一定要实现这个需求或者碰到问题一味地要产品让步。希望产品和技术都能一起愉快的玩耍:)
