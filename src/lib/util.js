import Url from 'licia/Url'
import contain from 'licia/contain'
import escapeJsStr from 'licia/escapeJsStr'
import isUndef from 'licia/isUndef'
import last from 'licia/last'
import map from 'licia/map'
import memStorage from 'licia/memStorage'
import toNum from 'licia/toNum'
import trim from 'licia/trim'
import html from 'licia/html'

// https://stackoverflow.com/questions/46318395/detecting-mobile-device-notch
export function hasSafeArea() {
  let proceed = false
  const div = document.createElement('div')
  if (CSS.supports('padding-bottom: env(safe-area-inset-bottom)')) {
    div.style.paddingBottom = 'env(safe-area-inset-bottom)'
    proceed = true
  } else if (CSS.supports('padding-bottom: constant(safe-area-inset-bottom)')) {
    div.style.paddingBottom = 'constant(safe-area-inset-bottom)'
    proceed = true
  }
  if (proceed) {
    document.body.appendChild(div)
    const calculatedPadding = parseInt(
      window.getComputedStyle(div).paddingBottom
    )
    document.body.removeChild(div)
    if (calculatedPadding > 0) {
      return true
    }
  }
  return false
}

export function escapeJsonStr(str) {
  return escapeJsStr(str).replace(/\\'/g, "'").replace(/\t/g, '\\t')
}

export function safeStorage(type, memReplacement) {
  if (isUndef(memReplacement)) memReplacement = true

  let ret

  switch (type) {
    case 'local':
      ret = window.localStorage
      break
    case 'session':
      ret = window.sessionStorage
      break
  }

  try {
    // Safari private browsing
    const x = 'test-localStorage-' + Date.now()
    ret.setItem(x, x)
    const y = ret.getItem(x)
    ret.removeItem(x)
    if (y !== x) throw new Error()
  } catch {
    if (memReplacement) return memStorage
    return
  }

  return ret
}

export function getFileName(url) {
  let ret = last(url.split('/'))

  if (ret === '') {
    url = new Url(url)
    ret = url.hostname
  }

  return ret
}

export function pxToNum(str) {
  return toNum(str.replace('px', ''))
}

export function isErudaEl(el) {
  while (el) {
    if (el.id === 'eruda') return true
    el = el.parentNode
  }

  return false
}

export function isChobitsuEl(el) {
  while (el) {
    let className = ''
    if (el.getAttribute) {
      className = el.getAttribute('class') || ''
    }
    if (contain(className, '__chobitsu-hide__')) {
      return true
    }
    el = el.parentNode
  }

  return false
}

export function classPrefix(str) {
  if (/<[^>]*>/g.test(str)) {
    try {
      const tree = html.parse(str)
      traverseTree(tree, (node) => {
        if (node.attrs && node.attrs.class) {
          node.attrs.class = processClass(node.attrs.class)
        }
      })
      return html.stringify(tree)
    } catch {
      return processClass(str)
    }
  }

  return processClass(str)
}

function traverseTree(tree, handler) {
  for (let i = 0, len = tree.length; i < len; i++) {
    const node = tree[i]
    handler(node)
    if (node.content) {
      traverseTree(node.content, handler)
    }
  }
}

function processClass(str) {
  const prefix = 'eruda-'

  return map(trim(str).split(/\s+/), (singleClass) => {
    if (contain(singleClass, prefix)) {
      return singleClass
    }

    return singleClass.replace(/[\w-]+/, (match) => `${prefix}${match}`)
  }).join(' ')
}

export function eventClient(type, e) {
  const name = type === 'x' ? 'clientX' : 'clientY'

  if (e[name]) {
    return e[name]
  }
  if (e.changedTouches) {
    return e.changedTouches[0][name]
  }

  return 0
}

export function eventPage(type, e) {
  const name = type === 'x' ? 'pageX' : 'pageY'

  if (e[name]) {
    return e[name]
  }
  if (e.changedTouches) {
    return e.changedTouches[0][name]
  }

  return 0
}
