import { each, sortKeys } from '../lib/util'

function formatStyle(style) {
  const ret = {}

  for (let i = 0, len = style.length; i < len; i++) {
    const name = style[i]

    if (style[name] === 'initial') continue

    ret[name] = style[name]
  }

  return sortStyleKeys(ret)
}

const elProto = Element.prototype

let matchesSel = function() {
  return false
}
if (elProto.matches) {
  matchesSel = (el, selText) => el.matches(selText)
} else if (elProto.webkitMatchesSelector) {
  matchesSel = (el, selText) => el.webkitMatchesSelector(selText)
} else if (elProto.mozMatchesSelector) {
  matchesSel = (el, selText) => el.mozMatchesSelector(selText)
}
// /*
// function getCssRulesFromDocumentStyleSheets(media)
// {
//   var resultCssRules = '';
//   for (var i = 0; i < document.styleSheets.length; i++)
//   {
//     var styleSheet = document.styleSheets[i];

//     if (isRuleFromMedia(styleSheet, media))
//       resultCssRules += getCssRulesFromRuleList(styleSheet.cssRules || styleSheet.rules, media);
//   }

//   return resultCssRules;
// }

// function getCssRulesFromRuleList(rules, media)
// {
//   var resultCssRules = '';
//   for (var i = 0; i < rules.length; i++)
//   {
//     var rule = rules[i];
//     if (rule.type == 1) // CSSStyleRule
//     {
//       resultCssRules += rule.cssText + '\r\n';
//     }
//     else if (rule.type == 3) // CSSImportRule
//     {
//       if (isRuleFromMedia(rule, media))
//         resultCssRules += getCssRulesFromRuleList(rule.styleSheet.cssRules || rule.styleSheet.rules, media);
//     }
//     else if (rule.type == 4) // CSSMediaRule
//     {
//       if (isRuleFromMedia(rule, media))
//         resultCssRules += getCssRulesFromRuleList(rule.cssRules || rule.rules, media);
//     }
//   }

//   return resultCssRules;
// }

function isRuleFromMedia(ruleOrStyleSheet, media)
{
  while (ruleOrStyleSheet)
  {
    var mediaList = ruleOrStyleSheet.media;
    if (mediaList)
    {
      if (!isMediaListContainsValue(mediaList, media) && !isMediaListContainsValue(mediaList, 'all') && mediaList.length > 0)
        return false;
    }

    ruleOrStyleSheet = ruleOrStyleSheet.ownerRule || ruleOrStyleSheet.parentRule || ruleOrStyleSheet.parentStyleSheet;
  }

  return true;
}

function isMediaListContainsValue(mediaList, media)
{
  media = String(media).toLowerCase();

  for (var i = 0; i < mediaList.length; i++)
  {
    // Access to mediaList by '[index]' notation now work in IE (tested in versions 7, 8, 9)
    if (String(mediaList.item(i)).toLowerCase() == media)
      return true;
  }

  return false;
}

export default class CssStore {
  constructor(el) {
    this._el = el
  }
  getComputedStyle() {
    const computedStyle = window.getComputedStyle(this._el)

    return formatStyle(computedStyle)
  }
  getMatchedCSSRules() {
    const ret = []

    each(document.styleSheets, (styleSheet) => {
      try {
        // Started with version 64, Chrome does not allow cross origin script to access this property.
        if (!styleSheet.cssRules) return
      } catch (e) {
        return
      }

      // const medias = []
      // each(styleSheet.cssRules, cssRule => {
      //   if (cssRule.type == 4) {
      //     medias.push(cssRule.media)
      //   }
      // })
      const keyframes = []

      each(styleSheet.cssRules, rule => {
        if ((rule.type === window.CSSRule.KEYFRAMES_RULE || rule.type === window.CSSRule.WEBKIT_KEYFRAMES_RULE)) {
          keyframes.push(rule)
        }
      })

      each(styleSheet.cssRules, (cssRule) => {

        let matchesEl = false

        if (cssRule.type == 4) {
          const { media } = cssRule
          if (isRuleFromMedia(cssRule, media)) {
            each(cssRule.cssRules, (cssRule) => {
              let matchesEl = false

              try {
                matchesEl = this._elMatchesSel(cssRule.selectorText.replace(/::?(?:before|after)/i, ''))
                // remove visual element in check selector
                /* eslint-disable no-empty */
              } catch (e) {}

              if (!matchesEl) return

              ret.push({
                selectorText: cssRule.selectorText,
                media,
                styleRoot: cssRule.style,
                style: formatStyle(cssRule.style),
              })
            })

          }

        }

        // Mobile safari will throw DOM Exception 12 error, need to try catch it.
        try {
          matchesEl = this._elMatchesSel(cssRule.selectorText.replace(/::?(?:before|after)/i, ''))
          // remove visual element in check selector
          /* eslint-disable no-empty */
        } catch (e) {}

        if (!matchesEl) return
        
        ret.push({
          selectorText: cssRule.selectorText,
          styleRoot: cssRule.style,
          style: formatStyle(cssRule.style),
        })

        const animationName = cssRule.style.animationName.replace(/\s/g, '').split(',')
        
        if (animationName.length > 0) {
          animationName.forEach(animate => {
            animate = animate.toLowerCase() 
            keyframes.forEach(keyframe => { 
              if (keyframe.name.toLowerCase() == animate) {
                const blocks = []
                let index = 0
                let block
                while ( (block = keyframe[index++]) != null ) {
                  blocks.push({
                    keyText: block.keyText,
                    style: formatStyle(block.style),
                    styleRoot: block.style
                  })
                }
                ret.push({
                  name: keyframe.name,
                  blocks,
                  style: {},
                  isKeyframes: true
                })
              }
            })
          })
        }
      })
    })

    return ret
  }
  _elMatchesSel(selText) {
    return matchesSel(this._el, selText)
  }
}

function sortStyleKeys(style) {
  return sortKeys(style, {
    comparator: (a, b) => {
      const lenA = a.length
      const lenB = b.length
      const len = lenA > lenB ? lenB : lenA

      for (let i = 0; i < len; i++) {
        const codeA = a.charCodeAt(i)
        const codeB = b.charCodeAt(i)
        const cmpResult = cmpCode(codeA, codeB)

        if (cmpResult !== 0) return cmpResult
      }

      if (lenA > lenB) return 1
      if (lenA < lenB) return -1

      return 0
    },
  })
}
export const sortStyle = sortStyleKeys

function cmpCode(a, b) {
  a = transCode(a)
  b = transCode(b)

  if (a > b) return 1
  if (a < b) return -1
  return 0
}

function transCode(code) {
  // - should be placed after lowercase chars.
  if (code === 45) return 123
  return code
}