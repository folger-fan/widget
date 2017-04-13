var assign = function (target, src) {
    for (var key in src) {
        target[key] = src[key]
    }
};
var getTextWidth = (function () {
    var spanEl = document.createElement('span');
    var style = spanEl.style;
    assign(style, {
        position: 'absolute',
        left: '-100px'
    });
    document.body.appendChild(spanEl);
    /**
     * @param text 文本内容
     * @param fontStyle 字体样式，包含 fontSize,fontWeight,fontFamily等
     * @returns Number width 文本宽度
     */
    return function (text, fontStyle) {
        assign(style, fontStyle);
        spanEl.innerHTML = text;
        var width = window.getComputedStyle(spanEl, null).width;
        return Number(width.substring(0, width.length - 2));
    }
})();
/**
 *
 * @param text 文本内容
 * @param width 所在容器宽度，单位是px，可以用window.getComputedStyle获得
 * @param fontStyle 字体样式，包含 fontSize、fontWeight、fontFamily等
 * @param limit 行数
 * @returns String 缩略后的文本
 */
function getEllText(text, width, fontStyle, limit) {
    limit = limit || 1;
    if (!/^\d+\.?\d+px$/.test(width)) {
        throw new Error('目标节点的宽度不可解析' + width)
    }
    width = Number(width.substring(0, width.length - 2));
    var lineWidth = 0, textArr = text.split(''), lineArr = [], tempArr = [],
        ellLength = getTextWidth('&hellip;', fontStyle);
    for (var i = 0, textLen = textArr.length; i < textLen; i++) {
        var textWidth = getTextWidth(textArr[i], fontStyle);
        if (lineArr.length >= limit - 1 && lineWidth + ellLength + textWidth > width) {
            tempArr.push('&hellip;');
            lineArr.push(tempArr.join(''));
            return lineArr.join('')
        }
        if (lineWidth + textWidth <= width) {
            lineWidth += textWidth;
            tempArr.push(textArr[i]);
            if (i == textLen - 1) {
                lineArr.push(tempArr.join(''));
            }
        } else {
            lineArr.push(tempArr.join(''));
            tempArr = [];
            lineWidth = 0;
            lineWidth += textWidth;
            tempArr.push(textArr[i])
        }
    }
    return lineArr.join('')
}