/**
 * 替换url查询参数，返回新的url
 * @param name
 * @param value
 * @returns {string}
 */
function setUrlSearchParam(name, value) {
    var search = window.location.search;
    var paramArr = search ? search.replace('?', '').split('&') : [];
    var paramMap = {};
    for (var i = 0; i < paramArr.length; i++) {
        var itemArr = paramArr[i].split('=');
        paramMap[itemArr[0]] = itemArr[1]
    }
    paramMap[name] = value;
    var newArr = [];
    for (var key in paramMap) {
        newArr.push(key + '=' + paramMap[key])
    }
    return location.protocol + '//' + location.host + location.pathname + '?' + newArr.join('&') + location.hash
}