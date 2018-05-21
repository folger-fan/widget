
> [Tencent Server Web(TSW)](https://tswjs.org/guide/index)，是一套面向WEB前端开发者，以提升问题定位效率为初衷，提供染色抓包、全息日志和异常发现的Node.js基础设施。TSW关注业务的运维监控能力，适用于http、websocket协议的业务场景，可无缝与即有项目进行整合。支持公有云、私有云和本地部署。

# 我为什么选用TSW

一个好的运维工具要满足三个要求：

## 1.满足业务需求

Node最初是为了满足高并发。

>有个叫Ryan Dahl的歪果仁，他的工作是用C/C++写高性能Web服务。对于高性能、高并发，核心就是异步IO、事件驱动，但是用C/C\+\+写就太痛苦了。于是这位高人开始设想用高级语言开发Web服务。他评估了很多种高级语言，发现很多语言虽然同时提供了同步IO和异步IO，但是开发人员一旦用了同步IO，他们就再也懒得写异步IO了，所以，最终，Ryan瞄向了JavaScript。

因为Node不仅满足高并发，而且对会Js的前端开发友好，所以大量前端开始学习和实践Node。就我了解的，[阿里前端](http://2014.jsconf.cn/slides/herman-taobaoweb/index.html#/)和[腾讯前端](https://github.com/joeyguo/blog/issues/8)很多团队都将Node作为Web接入层划分到前端工作范畴，前端掌握Node有了更多的灵活性和更大的能力。

TSW包裹于Node服务外层，管理进程，接管和分发请求，对负载均衡做了一定的优化，服务于QQ空间等大流量业务，能满足高并发的需求。

## 2.易扩展

易扩展包括功能易实现，代码易调试，日志易追踪，新人易学习。

做业务逻辑的话Java、C\+\+等能做的Node都能做。

Js因为异步的原因回调多了代码难读，Promise、generator、async\await等新语法解决了异步回调的问题。

强大的Js编辑工具Webstorm，方便本地调试。[Node Inspector](https://github.com/node-inspector/node-inspector) + Chrome方便远程调试服务器代码

前端开发那么多，轻轻松松学会Node。想做点服务器的东西不再强依赖后台了。

那么关于日志追踪。本人以前做Java开发，一个请求就是一个线程，事先设置流水号，就能查到这个请求整个流程的日志信息。但是Node就麻烦了，因为是异步的，这个请求卡在一个IO上了，就去处理下一个请求了，一般的途径很难确定日志前后的关联性。有个办法是将变量存在req上，一直传递下去。还有种办法是用[domain](http://www.runoob.com/nodejs/nodejs-domain-module.html)模块，将多个不同的IO操作作为一个组，据了解TSW就是利用domain模块实现的日志全息收集。
![TSW全息日志](https://static.yk.qq.com/bikan/folger/blog/tsw/1.png)

从图可以看到，经染色后可将用户的http请求信息，服务器log，响应信息等全部上传到TSW平台查看。甚至可以下载下来在fiddler上查看。

## 3.易运维
服务器上服务停止了需要自动重启，这里有PM2，需要有个地方查看内存、cup等指标，PM2的话需要自己上服务器。TSW不仅满足了PM2进程管理的功能，而且可以在TSW平台上查看内存、cup等指标信息，还有监控告警。


# 如何上手

TSW在腾讯内部出现挺久了，本人还听过作者关于TSW的一堂课，当时惊讶Node能做这么多这么强大的事。但个人感觉内部版TSW跟SNG事业群某些内部工具有耦合，对我这样的外BG用户而言，用起来有点麻烦。折腾了一下就放弃了。直到现在TSW出现了开源版，剔除了跟内部工具耦合的部分，外BG、公司外用户可以零负担接入使用。

## 1.注册应用

登陆 [TSW官网](https://tswjs.org/profile) ，创建应用，获得appid和appkey

## 2.代码下载

TSW在腾讯内部git地址是 http://tc-svn.tencent.com/components/TSW_proj ，外部github地址是 https://github.com/Tencent/TSW 。

其中 TSW/examples/framework 目录下是一些demo代码，可以参考学习如何使用。

这里提一个坑，git将文件下载到windows上后，默认的配置会将unix文件转换为windows格式，提交后再将windows格式转换为unix格式。如果直接将windows上文件上传到服务器，sh文件执行会失败。

![git](https://static.yk.qq.com/bikan/folger/blog/tsw/4.jpg)


## 3.配置文件

本人的做法是先把TSW代码下下来。然后拷贝到自身代码库，跟业务代码目录平级
![代码目录](https://static.yk.qq.com/bikan/folger/blog/tsw/2.png),如图node文件夹是我的业务代码

修改TSW/conf目录下配置文件，指向自身业务代码目录的配置文件，这样把TSW和自身业务代码发布到服务器后，以后有配置修改，不需要动TSW里面的文件，修改自身业务代码就好。

![TSW配置文件](https://static.yk.qq.com/bikan/folger/blog/tsw/3.png)

参照TSW/examples/framework其中router文件，指定请求分发到自身业务代码入口

自身选用的框架可以是express、koa，TSW都有例子参考。


## 4.启动

在windows上可以执行node TSW启动,linux服务器上可以 执行node TSW启动，也可以进入TSW/bin/proxy执行相应的sh命令启动、停止。

## 5.热重启
配置文件中，可配置是否开发模式devMode ，开发模式下代码修改后立即生效，但会对性能造成影响。可在开发、测试环境中使用。

正式环境可以进入TSW/bin/proxy中执行reload.sh重启，也可以执行 curl 127.0.0.1:12701/reload 重启。

## 6.日志

可用plug('logger')加载TSW内置日志模块。在linux服务器上日志会记录在TSW/log目录中，TSW会自动切割和清理日志。当天日志在run.log.0中，以往日志在backup目录中。

经实验发现，只有处理http请求的时候才会记录日志，node服务启动所执行的操作不会记录日志，也就是业务服务初始化的日志不会记录。

经实验发现，不但可用plug('logger')记录日志，console下debug、info、log等方法也会记录日志信息，染色后也会上传到TSW平台。

## 7.染色

代码中需要在req处理时设置用户uin，logger.setKey(uin)。

当需要查看指定用户全息日志的时候，需要在TSW平台上应用配置中，在测试环境菜单中添加uin，

![测试号码](https://static.yk.qq.com/bikan/folger/blog/tsw/5.png)

进入全息日志菜单
![全息日志](https://static.yk.qq.com/bikan/folger/blog/tsw/6.png)
同时将url最后的xxx更改为你刚添加的uin

在TSW平台添加完需要监控的uin后，服务器上TSW会在此后自动将此uin的用户日志上传到TSW平台，这时就可以在全息日志菜单中看到实时全息日志了。添加uin之前的日志不会上传到TSW平台。

日志下载下来可以在fiddler中查看。

此功能方便开发侧调试用户复现的问题。


## 写在最后

是否选用某个工具还看用的爽不爽，出现问题会不会有人及时解决。在尝试使用TSW过程中确实碰到一些问题，本人找到TSW作者的时候，作者会耐心沟通分析解决问题，甚至会远程到我电脑上花费半个下午的时间帮我调试查找问题。如果找到TSW本身的问题，会及时修复代码。

相反的，本人在使用腾讯某产品开发时候碰到些问题，先在其官方论坛提交问题，响应不及时，问题没得到解决。本人仗着腾讯内部员工的便利，找到相关开发人员，提交了问题反馈，有些问题得到解决了，但有些问题没得到合理的处理，而且都是小半天才回一句。

> 在这里祝大家天天能怀着愉快的心情写代码。