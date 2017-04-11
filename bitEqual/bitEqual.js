/**
 * 判断a&b是否等于b,默认b小于a
 * @param a
 * @param b
 */
function bitEqual(a, b) {
    function getBitArr(num) {
        num = Number(num).toString(2);
        var arr = [];
        while (true) {
            if (num.length <= 30) {
                arr.push(num);
                break;
            }
            arr.push(num.substr(-30, 30));
            num = num.substring(0, num.length - 30)
        }
        return arr
    }

    var arrA = getBitArr(a);
    var arrB = getBitArr(b);
    for (var i = 0; i < arrA.length, i < arrB.length; i++) {
        var na = parseInt(arrA[i], 2), nb = parseInt(arrB[i], 2);
        if ((na & nb) != nb) {
            return false
        }
    }
    return true
}