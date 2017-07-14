/**
 * Created by folgerfan on 2017/7/14.
 */
var pageLeave = (function () {
    /**alert,prompt,confirm会阻塞js的执行，所以需要代理，排除这些方法的影响*/
    'alert,prompt,confirm'.split(',').forEach(function(fun) {
        var winOldFun = window[fun];
        window[fun] = function () {
            var result = winOldFun.apply(window, Array.prototype.slice.call(arguments, 0));
            reset();
            return result
        }
    });
    var cbkCache = [], started = false;
    var num, tb, si;
    var step = 500;

    function reset() {
        num = 0;
        tb = +new Date();
        if (si) {
            clearInterval(si)
        }
        si = setInterval(function () {
            var te = +new Date();
            num++;
            var dif = te - tb - num * step;
            console.log(dif);
            if (dif > pageLeave.leaveTime) {//正常情况下dif会是几ms
                reset();
                cbkCache.forEach(function(cbk){
                    cbk()
                });
            }
        }, step)
    }
    return function (cbk) {
        cbkCache.push(cbk);
        if (!started) {
            reset();
            started = true;
        }
    }
})();
pageLeave.leaveTime = 1000;//可以修改1000为其他值设置灵敏度
