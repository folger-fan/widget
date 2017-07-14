/**
 * Created by folgerfan on 2017/7/14.
 */
let showed = false;
window.onpageshow = function () {
    if (showed && iOsVer < 9) {
        location.reload()
    }
    showed = true;
};