import each from 'licia/each'
import sortKeys from 'licia/sortKeys'

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

let matchesSel = function () {
  return false
}

if (elProto.webkitMatchesSelector) {
  matchesSel = (el, selText) => el.webkitMatchesSelector(selText)
} else if (elProto.mozMatchesSelector) {
  matchesSel = (el, selText) => el.mozMatchesSelector(selText)
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
      } catch {
        return
      }

      each(styleSheet.cssRules, (cssRule) => {
        let matchesEl = false

        // Mobile safari will throw DOM Exception 12 error, need to try catch it.
        try {
          matchesEl = this._elMatchesSel(cssRule.selectorText)
        } catch {
          // No op
        }

        if (!matchesEl) return

        ret.push({
          selectorText: cssRule.selectorText,
          style: formatStyle(cssRule.style),
        })
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
