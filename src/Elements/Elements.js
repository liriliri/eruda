import Tool from '../DevTools/Tool'
import CssStore from './CssStore'
import Highlight from './Highlight'
import Select from './Select'
import Settings from '../Settings/Settings'
import {
  $,
  keys,
  MutationObserver,
  each,
  toStr,
  isEl,
  isStr,
  map,
  escape,
  startWith,
  isFn,
  isBool,
  safeGet,
  isNaN,
  isNum,
  nextTick,
  Emitter,
  contain,
  unique,
  isNull,
  trim,
  lowerCase,
  pick,
} from '../lib/util'
import { pxToNum } from '../lib/fione'
import { isErudaEl } from '../lib/extraUtil'
import evalCss from '../lib/evalCss'

export default class Elements extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Elements.scss'))

    this.name = 'elements'
    this._tpl = require('./Elements.hbs')
    this._rmDefComputedStyle = true
    this._highlightElement = false
    this._selectElement = false
    this._observeElement = true
    this._computedStyleSearchKeyword = ''
    this._history = []

    Emitter.mixin(this)
  }
  init($el, container) {
    super.init($el)

    this._container = container

    $el.html('<div class="eruda-show-area"></div>')
    this._$showArea = $el.find('.eruda-show-area')
    $el.append(require('./BottomBar.hbs')())

    this._htmlEl = document.documentElement
    this._highlight = new Highlight(this._container.$container)
    this._select = new Select()
    this._bindEvent()
    this._initObserver()
    this._initCfg()

    nextTick(() => this._updateHistory())
  }
  show() {
    super.show()

    if (this._observeElement) this._enableObserver()
    if (!this._curEl) this._setEl(this._htmlEl)
    this._render()
  }
  hide() {
    this._disableObserver()

    return super.hide()
  }
  set(e) {
    if (e === this._curEl) return

    this._setEl(e)
    this.scrollToTop()
    this._render()
    this._updateHistory()

    this.emit('change', e)

    return this
  }
  overrideEventTarget() {
    const winEventProto = getWinEventProto()

    const origAddEvent = (this._origAddEvent = winEventProto.addEventListener)
    const origRmEvent = (this._origRmEvent = winEventProto.removeEventListener)

    winEventProto.addEventListener = function (type, listener, useCapture) {
      addEvent(this, type, listener, useCapture)
      origAddEvent.apply(this, arguments)
    }

    winEventProto.removeEventListener = function (type, listener, useCapture) {
      rmEvent(this, type, listener, useCapture)
      origRmEvent.apply(this, arguments)
    }
  }
  scrollToTop() {
    const el = this._$showArea.get(0)

    el.scrollTop = 0
  }
  restoreEventTarget() {
    const winEventProto = getWinEventProto()

    if (this._origAddEvent) winEventProto.addEventListener = this._origAddEvent
    if (this._origRmEvent) winEventProto.removeEventListener = this._origRmEvent
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
    this._select.disable()
    this._highlight.destroy()
    this._disableObserver()
    this.restoreEventTarget()
    this._rmCfg()
  }
  _back() {
    if (this._curEl === this._htmlEl) return

    const parentQueue = this._curParentQueue
    let parent = parentQueue.shift()

    while (!isElExist(parent)) parent = parentQueue.shift()

    this.set(parent)
  }
  _bindEvent() {
    const self = this
    const container = this._container
    const select = this._select

    this._$el
      .on('click', '.eruda-child', function () {
        const idx = $(this).data('idx')
        const curEl = self._curEl
        const el = curEl.childNodes[idx]

        if (el && el.nodeType === 3) {
          const curTagName = curEl.tagName
          let type

          switch (curTagName) {
            case 'SCRIPT':
              type = 'js'
              break
            case 'STYLE':
              type = 'css'
              break
            default:
              return
          }

          const sources = container.get('sources')

          if (sources) {
            sources.set(type, el.nodeValue)
            container.showTool('sources')
          }

          return
        }

        !isElExist(el) ? self._render() : self.set(el)
      })
      .on('click', '.eruda-listener-content', function () {
        const text = $(this).text()
        const sources = container.get('sources')

        if (sources) {
          sources.set('js', text)
          container.showTool('sources')
        }
      })
      .on('click', '.eruda-breadcrumb', () => {
        const sources = container.get('sources')

        if (sources) {
          sources.set('object', this._curEl)
          container.showTool('sources')
        }
      })
      .on('click', '.eruda-parent', function () {
        let idx = $(this).data('idx')
        const curEl = self._curEl
        let el = curEl.parentNode

        while (idx-- && el.parentNode) el = el.parentNode

        !isElExist(el) ? self._render() : self.set(el)
      })
      .on('click', '.eruda-toggle-all-computed-style', () =>
        this._toggleAllComputedStyle()
      )
      .on('click', '.eruda-computed-style-search', () => {
        let filter = prompt('Filter')
        if (isNull(filter)) return
        filter = trim(filter)
        this._computedStyleSearchKeyword = filter
        this._render()
      })

    const $bottomBar = this._$el.find('.eruda-bottom-bar')

    $bottomBar
      .on('click', '.eruda-refresh', () => {
        this._render()
        container.notify('Refreshed')
      })
      .on('click', '.eruda-highlight', () => this._toggleHighlight())
      .on('click', '.eruda-select', () => this._toggleSelect())
      .on('click', '.eruda-reset', () => this.set(this._htmlEl))

    select.on('select', (target) => this.set(target))
  }
  _toggleAllComputedStyle() {
    this._rmDefComputedStyle = !this._rmDefComputedStyle

    this._render()
  }
  _enableObserver() {
    this._observer.observe(this._htmlEl, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  }
  _disableObserver() {
    this._observer.disconnect()
  }
  _toggleHighlight() {
    if (this._selectElement) return

    this._$el.find('.eruda-highlight').toggleClass('eruda-active')
    this._highlightElement = !this._highlightElement

    this._render()
  }
  _toggleSelect() {
    const select = this._select

    this._$el.find('.eruda-select').toggleClass('eruda-active')
    if (!this._selectElement && !this._highlightElement) this._toggleHighlight()
    this._selectElement = !this._selectElement

    if (this._selectElement) {
      select.enable()
      this._container.hide()
    } else {
      select.disable()
    }
  }
  _setEl(el) {
    this._curEl = el
    this._curCssStore = new CssStore(el)
    this._highlight.setEl(el)
    this._rmDefComputedStyle = true

    const parentQueue = []

    let parent = el.parentNode
    while (parent) {
      parentQueue.push(parent)
      parent = parent.parentNode
    }
    this._curParentQueue = parentQueue
  }
  _getData() {
    const ret = {}

    const el = this._curEl
    const cssStore = this._curCssStore

    const { className, id, attributes, tagName } = el

    ret.computedStyleSearchKeyword = this._computedStyleSearchKeyword
    ret.parents = getParents(el)
    ret.children = formatChildNodes(el.childNodes)
    ret.attributes = formatAttr(attributes)
    ret.name = formatElName({ tagName, id, className, attributes })

    const events = el.erudaEvents
    if (events && keys(events).length !== 0) ret.listeners = events

    if (needNoStyle(tagName)) return ret

    let computedStyle = cssStore.getComputedStyle()

    function getBoxModelValue(type) {
      let keys = ['top', 'left', 'right', 'bottom']
      if (type !== 'position') keys = map(keys, (key) => `${type}-${key}`)
      if (type === 'border') keys = map(keys, (key) => `${key}-width`)

      return {
        top: boxModelValue(computedStyle[keys[0]], type),
        left: boxModelValue(computedStyle[keys[1]], type),
        right: boxModelValue(computedStyle[keys[2]], type),
        bottom: boxModelValue(computedStyle[keys[3]], type),
      }
    }

    const boxModel = {
      margin: getBoxModelValue('margin'),
      border: getBoxModelValue('border'),
      padding: getBoxModelValue('padding'),
      content: {
        width: boxModelValue(computedStyle['width']),
        height: boxModelValue(computedStyle['height']),
      },
    }

    if (computedStyle['position'] !== 'static') {
      boxModel.position = getBoxModelValue('position')
    }
    ret.boxModel = boxModel

    const styles = cssStore.getMatchedCSSRules()
    styles.unshift(getInlineStyle(el.style))
    styles.forEach((style) => processStyleRules(style.style))
    ret.styles = styles

    if (this._rmDefComputedStyle) {
      computedStyle = rmDefComputedStyle(computedStyle, styles)
    }
    
    ret.rmDefComputedStyle = this._rmDefComputedStyle
    const computedStyleSearchKeyword = lowerCase(ret.computedStyleSearchKeyword)
    if (computedStyleSearchKeyword) {
      computedStyle = pick(computedStyle, (val, property) => {
        return (
          contain(property, computedStyleSearchKeyword) ||
          contain(val, computedStyleSearchKeyword)
        )
      })
    }
    processStyleRules(computedStyle)
    ret.computedStyle = computedStyle

    return ret
  }
  _render() {
    if (!isElExist(this._curEl)) return this._back()

    this._highlight[this._highlightElement ? 'show' : 'hide']()
    const data = this._getData()
    this._renderHtml(this._tpl(data), data)
  }
  _renderHtml(html, data) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$showArea.html(html)
    
    const settings = this._container.get('settings')
console.log( settings )
    /*eslint no-unused-vars: "error"*/
    this._$showArea.find('*[data-editor]').each((index, item) => {
      const path = item.getAttribute('data-editor').split('_')
      let style = data.styles[path[0]]
      if ( path.length == 3 ) {
        style = style.blocks[path[1]]
      }
        const name = path[path.length - 1]
      item.removeAttribute('data-editor')
      $(item).on('click', () => {
        const oldVal = style.styleRoot[name]
        const newVal = window.prompt(`Set CSS ${name}`, oldVal)
        if ( oldVal != newVal) {
          style.styleRoot[ name ] = newVal
          $(item).find('[data-value]').text(newVal)
        }
      })
    })
  }
  _updateHistory() {
    const console = this._container.get('console')
    if (!console) return

    const history = this._history
    history.unshift(this._curEl)
    if (history.length > 5) history.pop()
    for (let i = 0; i < 5; i++) {
      console.setGlobal(`$${i}`, history[i])
    }
  }
  _initObserver() {
    this._observer = new MutationObserver((mutations) => {
      each(mutations, (mutation) => this._handleMutation(mutation))
    })
  }
  _handleMutation(mutation) {
    let i, len, node

    if (isErudaEl(mutation.target)) return

    if (mutation.type === 'attributes') {
      if (mutation.target !== this._curEl) return
      this._render()
    } else if (mutation.type === 'childList') {
      if (mutation.target === this._curEl) return this._render()

      const addedNodes = mutation.addedNodes

      for (i = 0, len = addedNodes.length; i < len; i++) {
        node = addedNodes[i]

        if (node.parentNode === this._curEl) return this._render()
      }

      const removedNodes = mutation.removedNodes

      for (i = 0, len = removedNodes.length; i < len; i++) {
        if (removedNodes[i] === this._curEl) return this.set(this._htmlEl)
      }
    }
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'overrideEventTarget')
      .remove(cfg, 'observeElement')
      .remove('Elements')
  }
  _initCfg() {
    const cfg = (this.config = Settings.createCfg('elements', {
      overrideEventTarget: true,
      observeElement: true,
    }))

    if (cfg.get('overrideEventTarget')) this.overrideEventTarget()
    if (cfg.get('observeElement')) this._observeElement = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'overrideEventTarget':
          return val ? this.overrideEventTarget() : this.restoreEventTarget()
        case 'observeElement':
          this._observeElement = val
          return val ? this._enableObserver() : this._disableObserver()
      }
    })

    const settings = this._container.get('settings')
    if (!settings) return

    settings
      .text('Elements')
      .switch(cfg, 'overrideEventTarget', 'Catch Event Listeners')

    if (this._observer) settings.switch(cfg, 'observeElement', 'Auto Refresh')

    settings.separator()
  }
}

function processStyleRules(style) {
  each(style, (val, key) => (style[key] = processStyleRule(val)))
}

const regColor = /rgba?\((.*?)\)/g
const regCssUrl = /url\("?(.*?)"?\)/g

function processStyleRule(val) {
  // For css custom properties, val is unable to retrieved.
  val = toStr(val)

  return val
    .replace(
      regColor,
      '<span class="eruda-style-color" style="background-color: $&"></span>$&'
    )
    .replace(regCssUrl, (match, url) => `url("${wrapLink(url)}")`)
}

const isElExist = (val) => isEl(val) && val.parentNode

function formatElName(data, { noAttr = false } = {}) {
  const { id, className, attributes } = data

  let ret = `<span class="eruda-tag-name-color">${data.tagName.toLowerCase()}</span>`

  if (id !== '') ret += `<span class="eruda-function-color">#${id}</span>`

  if (isStr(className)) {
    let classes = ''
    each(className.split(/\s+/g), (val) => {
      if (val.trim() === '') return
      classes += `.${val}`
    })
    ret += `<span class="eruda-attribute-name-color">${classes}</span>`
  }

  if (!noAttr) {
    each(attributes, (attr) => {
      const name = attr.name
      if (name === 'id' || name === 'class' || name === 'style') return
      ret += ` <span class="eruda-attribute-name-color">${name}</span><span class="eruda-operator-color">="</span><span class="eruda-string-color">${attr.value}</span><span class="eruda-operator-color">"</span>`
    })
  }

  return ret
}

const formatAttr = (attributes) =>
  map(attributes, (attr) => {
    let { value } = attr
    const { name } = attr
    value = escape(value)

    const isLink =
      (name === 'src' || name === 'href') && !startWith(value, 'data')
    if (isLink) value = wrapLink(value)
    if (name === 'style') value = processStyleRule(value)

    return { name, value }
  })

function formatChildNodes(nodes) {
  const ret = []

  for (let i = 0, len = nodes.length; i < len; i++) {
    const child = nodes[i]
    const nodeType = child.nodeType

    if (nodeType === 3 || nodeType === 8) {
      const val = child.nodeValue.trim()
      if (val !== '')
        ret.push({
          text: val,
          isCmt: nodeType === 8,
          idx: i,
        })
      continue
    }

    const isSvg = !isStr(child.className)

    if (
      nodeType === 1 &&
      child.id !== 'eruda' &&
      (isSvg || child.className.indexOf('eruda') < 0)
    ) {
      ret.push({
        text: formatElName(child),
        isEl: true,
        idx: i,
      })
    }
  }

  return ret
}

function getParents(el) {
  const ret = []
  let i = 0
  let parent = el.parentNode

  while (parent && parent.nodeType === 1) {
    ret.push({
      text: formatElName(parent, { noAttr: true }),
      idx: i++,
    })

    parent = parent.parentNode
  }

  return ret.reverse()
}

function getInlineStyle(style) {
  const ret = {
    selectorText: 'element.style',
    style: {},
  }

  for (let i = 0, len = style.length; i < len; i++) {
    const s = style[i]

    ret.style[s] = style[s]
  }

  return ret
}

function rmDefComputedStyle(computedStyle, styles) {
  const ret = {}

  let keepStyles = ['display', 'width', 'height']
  each(styles, (style) => {
    keepStyles = keepStyles.concat(keys(style.style))
  })
  keepStyles = unique(keepStyles)

  each(computedStyle, (val, key) => {
    if (!contain(keepStyles, key)) return

    ret[key] = val
  })

  return ret
}

const NO_STYLE_TAG = ['script', 'style', 'meta', 'title', 'link', 'head']

const needNoStyle = (tagName) =>
  NO_STYLE_TAG.indexOf(tagName.toLowerCase()) > -1

function addEvent(el, type, listener, useCapture = false) {
  if (!isEl(el) || !isFn(listener) || !isBool(useCapture)) return

  const events = (el.erudaEvents = el.erudaEvents || {})

  events[type] = events[type] || []
  events[type].push({
    listener: listener,
    listenerStr: listener.toString(),
    useCapture: useCapture,
  })
}

function rmEvent(el, type, listener, useCapture = false) {
  if (!isEl(el) || !isFn(listener) || !isBool(useCapture)) return

  const events = el.erudaEvents

  if (!(events && events[type])) return

  const listeners = events[type]

  for (let i = 0, len = listeners.length; i < len; i++) {
    if (listeners[i].listener === listener) {
      listeners.splice(i, 1)
      break
    }
  }

  if (listeners.length === 0) delete events[type]
  if (keys(events).length === 0) delete el.erudaEvents
}

const getWinEventProto = () => {
  return safeGet(window, 'EventTarget.prototype') || window.Node.prototype
}

const wrapLink = (link) => `<a href="${link}" target="_blank">${link}</a>`

function boxModelValue(val, type) {
  if (isNum(val)) return val

  if (!isStr(val)) return '‒'

  const ret = pxToNum(val)
  if (isNaN(ret)) return val

  if (type === 'position') return ret

  return ret === 0 ? '‒' : ret
}
