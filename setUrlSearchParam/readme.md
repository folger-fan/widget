# 设置url中search部分参数

有这样的一种场景，页面跳转，但只需要更改url中search部分的某个参数
例如 http://a.tet.com?a=1#view 跳转到 http://a.test.com?a=2#view
或者追加一个参数时间戳
例如 http://a.tet.com?a=1#view 跳转到 http://a.tet.com?a=1&_t=1491993582491#view
setUrlSearchParam就是为类似这种问题准备的