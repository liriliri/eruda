import {each} from '../lib/util';

function formatStyle(style)
{
    let ret = {};

    for (let i = 0, len = style.length; i < len; i++)
    {
        let name = style[i];

        if (style[name] === 'initial') continue;

        ret[name] = style[name];
    }

    return ret;
}

let elProto = Element.prototype;

let matchesSel = function () { return false; };

if (elProto.webkitMatchesSelector)
{
    matchesSel = (el, selText) => el.webkitMatchesSelector(selText);
} else if (elProto.mozMatchesSelector)
{
    matchesSel = (el, selText) => el.mozMatchesSelector(selText);
}

export default class CssStore
{
    constructor(el)
    {
        this._el = el;
    }
    getComputedStyle()
    {
        let computedStyle = window.getComputedStyle(this._el);

        return formatStyle(computedStyle);
    }
    getMatchedCSSRules()
    {
        let ret = [];

        each(document.styleSheets, (styleSheet) =>
        {
            // Started with version 64, Chrome does not allow cross origin script to access this property.
            if (!styleSheet.hasOwnProperty('cssRules')) return;

            each(styleSheet.cssRules, (cssRule) =>
            {
                let matchesEl = false;

                // Mobile safari will throw DOM Exception 12 error, need to try catch it.
                try {
                    matchesEl = this._elMatchesSel(cssRule.selectorText);
                /* eslint-disable no-empty */
                } catch (e) {}

                if (!matchesEl) return;

                ret.push({
                    selectorText: cssRule.selectorText,
                    style: formatStyle(cssRule.style)
                });
            });
        });

        return ret;
    }
    _elMatchesSel(selText)
    {
        return matchesSel(this._el, selText);
    }
}
