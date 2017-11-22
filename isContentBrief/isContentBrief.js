/**
 * Created by folgerfan on 2017/11/22.
 */
function isContentBrief(wrapperP) {
    let childNodes = wrapperP.childNodes;
    if (wrapperP.childNodes.length !== 1 || wrapperP.childNodes[0].nodeName !== '#text') {
        throw new Error('父节点内容不是纯文字')
    }
    var content = wrapperP.innerHTML.replace(/^\s+/, '').replace(/\s+$/, '');
    var contentArr = [];
    for (var i = 0; i < content.length; i++) {
        contentArr.push('<span>' + content[i] + '</span>')
    }
    wrapperP.innerHTML = contentArr.join('');
    var lastSpan = childNodes[childNodes.length - 1];
    var result = lastSpan.offsetTop >= wrapperP.offsetTop + wrapperP.offsetHeight;
    wrapperP.innerHTML = content;
    return result;
}