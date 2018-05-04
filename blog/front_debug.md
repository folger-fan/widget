前端开发者很重要的一个工作就是调试了。

线上出问题了，赶紧看看

服务器是别人开发的，想在自己电脑调用测试或正式接口

手机访问开发环境(自己电脑)的页面

此文讲述笔者日常工作中常用的三个工具————Fidller、Switch Host、Nginx

谷歌、火狐浏览器的调试工具这里就不说了，大家都要会用的。

# Fiddler+Willow插件
[Fiddler](https://www.telerik.com/fiddler)是客户端和服务器之间的代理，网上很多文章把它描述为抓包神器。

结合[Willow](http://qzonetouch.github.io/commonWidget/willow)插件我们在日常工作中可以用它来将静态文件请求代理到本地文件，手机设置代理访问本地机器的页面。

Fiddler的其他功能可自行在网上查找，这里介绍Fiddler结合Willow的使用说明

## 本地资源代理
打个比方，线上页面出问题了，本地不好复现，那么可以在本地浏览器打开线上页面，将指定js、css等资源代理到本地资源，修改本地资源刷新浏览器就可以看到修改后的效果。

![单文件代理](https://p.qpic.cn/wyp_pic/duc2TvpEgSSBDkNcMuL4tEowqGhsePaiaV5IicRQDibBrhfLR7yT7UfY7g4L6kRoqO3/0)

单个文件代理，Fiddler本身也有这个功能，但Willow更好用些，Willow还可以代理整个目录

![目录代理](https://p.qpic.cn/wyp_pic/duc2TvpEgSSucRcTeer3vKcHxBukAibVWmW12fkbB5tgpMAgVJvKFqmsibBswQtF9H/0)

![目录代理](https://p.qpic.cn/wyp_pic/duc2TvpEgSSHt5LEhECwzgNbMu6pAhpHYPNGhIVSPA6VyIvBjic5h8PsP36h1fhics/0)

经过本人踩坑，这里需要注意的是url最后需要加/，目录后面需要加\。

### 手机请求代理

移动web开发在谷歌手机调试器上调试好后还需要用真机验证，往往会有各种手机兼容性问题。

Fiddler设置如图

![代理设置](https://p.qpic.cn/wyp_pic/duc2TvpEgSSlK4gvWzicp6kWqqBibteHVzYJ11icgO3zib48d9R3ZQtiasoAnXIib65zgo/0)

需要注意的是 `Allow remote computers to connect`选项一定要勾上，不然手机设置代理后连不到网

手机和PC需要在同一个局域网中。在作者公司中台式电脑和无线网不是一个局域网，那么就需要台式机插上无线网卡跟手机连同一个wifi。

手机的wifi设置中可以添加代理

![手机代理](https://p.qpic.cn/wyp_pic/duc2TvpEgSQV18ZQS7G6Jq0wENicOONefXhLkfCTHDC3ZgPVZtyZlohaIXOcibibtyv/364)

服务器主机名为电脑的ip，端口填Fidller监听的端口，上面图片有标出7777

把电脑浏览器的地址复制下，传到手机，就可以在手机浏览器打开本地页面了。

在Fiddler的使用过程中经常会代理无效，需要时不时的开启它的代理，如下图标注,无效的时候是白的，点击一下就行。

![生效](https://p.qpic.cn/wyp_pic/duc2TvpEgSSBtLHT23J0ibWYjrnicNicHdvKVCHHBVX1Biaap34kyia0M2bs7TJmZ5Ict/0)

作者用Fiddler做本地资源代理，借助另外要讲的两个工具也能完成，但Fiddler经常失效，需要时不时的点击左下角使Fiddler生效，所以作者除非调试手机页面，一般不用Fiddler。

# Switch Host
网上这类工具很多，自行搜索下载。作用是切换域名和ip的绑定关系。打个比方，在本地机器起了个Node服务，监听8080端口，用Switch Host工具将 `folger.test.com`域名绑定到`127.0.0.1`(本地机器ip等同`localhost`)。那么访问 `folger.test.com:8080`等同于访问`localhost:8080`。
![switch host](https://p.qpic.cn/wyp_pic/duc2TvpEgSRfInDtM0zouWWgySZU2wILhczoFWgOUZXAyQAFNjpnZUAmDOZmSrrA/0)
Fiddler上也有这个功能，但作者更常用这类切换Host专用的工具配合Nginx做开发调试的工作。

# Nginx
Nginx是一个高性能的HTTP和反向代理软件

作为前端开发者，如果你不能掌控服务器的话，那么最好要学会用Nginx配置代理。

## 接口转发

作者以前做Java Web开发，自己机器起服务，在浏览器可直接访问本地服务。现在转前端，后台服务往往是其他人负责，自己电脑不一定能搭建起一套开发环境后台服务。那么就需要利用Nginx将接口调用转发到测试、生产环境。总不能每次写完上传到测试环境服务器调试吧。

举个例子，后台服务在`1.1.1.1`服务器端口8080上，有一个接口叫 `/test`。域名是`folger.test.com`。那么正常情况下调用这个接口是`folger.test.com/test`

那么我们可以切host，将`folger.test.com`指向本地ip `127.0.0.1`，启动Nginx，将`/test`的请求全部转发到`1.1.1.1`。

![nginx redirect](https://p.qpic.cn/wyp_pic/duc2TvpEgSRec1M8iaiclQBfHVmCyRybpY155XhgWuyZMV1Bc8PcgfCFgwfw3e2ia01/0)

详细点的nginx可以网上搜索。

## 本地文件代理

Nginx还可以将请求代理到本地，很多服务器的静态文件服务就是用的Nginx做反向代理，这也是Nginx的强项。

![本地文件代理](https://p.qpic.cn/wyp_pic/duc2TvpEgSQstjpgo7yQpJ9HiaRucNRic4IURvGfvh6MvfQkS3E0cHJXNsvwLou83a/0)

借助Nginx和Switch Host，域名下静态资源可以代理到本地，接口可以代理到测试、正式环境接口，极大方便了开发阶段的开发调试工作。

## 踩坑
作者windows电脑上Nginx的启动命令nginx.exe，直接点击是无效的，需要进入命令行模式启动。为了方便操作，作者在Nginx目录下自己写了两个bat文件，启动和重启Nginx：

start.bat `start nginx.exe`

restart.bat `nginx -s reload`

作者的Windows下Nginx偶尔出现修改配置文件，怎么重启都没效果，本人对Nginx不算精通，一般都是重启电脑。

用的时候双击这两个bat文件就可以完成Nginx的启动、重启

