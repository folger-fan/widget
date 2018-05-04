>世上本无坑，踩的多了，坑就出来了

### 代码片段
wechatide://minicode/JDA5a9mA6SZz

### 效果视频

[安卓机](https://static.yk.qq.com/bikan/folger/blog/mp/7970ce22f213de335c269945e08e8a0d.mp4)

拿ios试了下，效果跟安卓基本差不多的

### 动画实现方案分类
跟平常页面做动画类似但也有很大区别。小程序无法直接操作节点，只能通过setData的方式更新界面。可选的方式有以下三种

#### 1.transition

通过设置transition属性，修改对应css属性，实现动画

#### 2.animation

通过小程序提供的animation实现动画

#### 3.setTimeout

实时计算节点的css属性值，实现动画(这个算是传统的js实现动画)

### 小程序组件分类
小程序组件大体可分为两类

#### 1.webview中的组件

如button、input、image等一般组件

这些组件任何动画方案都可以达到效果

#### 2.客户端原生组件

如video，map等。以及原生组件中包含的cover-view、cover-image等

原生组件层级最高的，webview组件无法在其上显示，所以有了cover-view、cover-image，可显示在video上。

这些组件，经实验，video组件动画效果有问题(map未实验)。video下的cover-view支持animation和transition(修改transform属性)。

客户端原生组件不支持touch事件。经实验安卓客户端的video是支持的，但video下的cover-view，cover-image是不支持的。咨询过小程序相关开发人员。安卓理应不支持的，只是事件穿透了(这应该算小程序的bug)。小程序接下来的版本中会支持 cover-view 的touch事件
### 动画场景分类

#### 1.不随手指动

这就是一般情况下的动画，比较好实现

#### 2.随手指动

这种情况下做动画，需要注意的是将duration设为0，页面随touchmove实时setData变化，不然会卡顿。具体实现可参考iscroll源码。

#### 3.弹性、惯性滑动

这是上面1和2的结合，随手指动的时候实时setData更新页面，手指移开后可使用相应算法在setTimeout中实时setData更新页面。具体算法可参考iScroll源码。


iscroll结合小程序的源码解读可参考 https://github.com/folger-fan/mp-scroll-demo




