import Tool from '../DevTools/Tool'
import LunaObjectViewer from 'luna-object-viewer'
import Settings from '../Settings/Settings'
import ajax from 'licia/ajax'
import each from 'licia/each'
import isStr from 'licia/isStr'
import escape from 'licia/escape'
import truncate from 'licia/truncate'
import replaceAll from 'licia/replaceAll'
import highlight from 'licia/highlight'
import trim from 'licia/trim'
import escapeRegExp from 'licia/escapeRegExp'
import LunaTextViewer from 'luna-text-viewer'
import evalCss from '../lib/evalCss'
import { classPrefix as c } from '../lib/util'

export default class Sources extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Sources.scss'))

    this.name = 'sources'
    this._showLineNum = true
    this._objViewer = null
    this._sourceObjects = new WeakMap()
    this._searchTimer = null
    this._searchMatches = []
    this._searchIndex = -1
    this._searchTotal = 0
    this._searchLimited = false
  }
  init($el, container) {
    super.init($el)

    this._container = container
    this._bindEvent()
    this._initCfg()
  }
  destroy() {
    this._resetObjectSearch()
    this._destroyObjViewer()
    super.destroy()

    evalCss.remove(this._style)
    this._rmCfg()
  }
  set(type, val) {
    if (type === 'img') {
      this._isFetchingData = true

      const img = new Image()

      const self = this

      img.onload = function () {
        self._isFetchingData = false
        self._data = {
          type: 'img',
          val: {
            width: this.width,
            height: this.height,
            src: val,
          },
        }

        self._render()
      }
      img.onerror = function () {
        self._isFetchingData = false
      }

      img.src = val

      return
    }

    this._data = { type, val }

    this._render()

    return this
  }
  show() {
    super.show()

    if (!this._data && !this._isFetchingData) {
      this._renderDef()
    }

    return this
  }
  _renderDef() {
    if (this._html) {
      this._data = {
        type: 'html',
        val: this._html,
      }

      return this._render()
    }

    if (this._isGettingHtml) return
    this._isGettingHtml = true

    ajax({
      url: location.href,
      success: (data) => (this._html = data),
      error: () => (this._html = 'Sorry, unable to fetch source code:('),
      complete: () => {
        this._isGettingHtml = false
        this._renderDef()
      },
      dataType: 'raw',
    })
  }
  _bindEvent() {
    this._container.on('showTool', (name, lastTool) => {
      if (name !== this.name && lastTool.name === this.name) {
        delete this._data
      }
    })

    this._$el
      .on('input', c('.source-search-input'), this._scheduleObjectSearch)
      .on('keydown', c('.source-search-input'), this._onSearchKeydown)
      .on('click', c('.source-search-prev'), this._searchPrevious)
      .on('click', c('.source-search-next'), this._searchNext)
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')

    if (!settings) return

    settings.remove(cfg, 'showLineNum').remove('Sources')
  }
  _initCfg() {
    const cfg = (this.config = Settings.createCfg('sources', {
      showLineNum: true,
    }))

    if (!cfg.get('showLineNum')) this._showLineNum = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'showLineNum':
          this._showLineNum = val
          return
      }
    })

    const settings = this._container.get('settings')
    settings
      .text('Sources')
      .switch(cfg, 'showLineNum', 'Show Line Numbers')
      .separator()
  }
  _render() {
    this._isInit = true
    this._resetObjectSearch()
    this._destroyObjViewer()

    const data = this._data

    switch (data.type) {
      case 'html':
      case 'js':
      case 'css':
        return this._renderCode()
      case 'img':
        return this._renderImg()
      case 'object':
        return this._renderObj()
      case 'raw':
        return this._renderRaw()
      case 'iframe':
        return this._renderIframe()
    }
  }
  _renderImg() {
    const { width, height, src } = this._data.val

    this._renderHtml(`<div class="${c('image')}">
      <div class="${c('breadcrumb')}">${escape(src)}</div>
      <div class="${c('img-container')}" data-exclude="true">
        <img src="${escape(src)}">
      </div>
      <div class="${c('img-info')}">${escape(width)} × ${escape(height)}</div>
    </div>`)
  }
  _renderCode() {
    const data = this._data

    this._renderHtml(
      `<div class="${c('code')}" data-type="${data.type}"></div>`,
      false,
    )

    let code = data.val
    const len = data.val.length

    if (len > MAX_RAW_LEN) {
      code = truncate(code, MAX_RAW_LEN)
    }

    // If source code too big, don't process it.
    if (len < MAX_BEAUTIFY_LEN) {
      code = highlight(code, data.type, {
        comment: '',
        string: '',
        number: '',
        keyword: '',
        operator: '',
      })
      each(['comment', 'string', 'number', 'keyword', 'operator'], (type) => {
        code = replaceAll(code, `class="${type}"`, `class="${c(type)}"`)
      })
    } else {
      code = escape(code)
    }

    const container = this._$el.find(c('.code')).get(0)
    new LunaTextViewer(container, {
      text: code,
      escape: false,
      wrapLongLines: true,
      showLineNumbers: data.val.length < MAX_LINE_NUM_LEN && this._showLineNum,
    })
  }
  _renderObj() {
    // Using cache will keep binding events to the same elements.
    this._renderHtml(
      `<div class="${c('source-search')}" role="search">
        <span class="${c(
          'icon-search source-search-icon',
        )}" aria-hidden="true"></span>
        <input class="${c(
          'source-search-input',
        )}" type="search" placeholder="Find in JSON" aria-label="Find in JSON source" autocomplete="off" spellcheck="false">
        <span class="${c('source-search-count')}" aria-live="polite">0/0</span>
        <button class="${c(
          'source-search-button source-search-prev',
        )}" type="button" title="Previous match" aria-label="Previous match" disabled>&uarr;</button>
        <button class="${c(
          'source-search-button source-search-next',
        )}" type="button" title="Next match" aria-label="Next match" disabled>&darr;</button>
      </div>
      <ul class="${c('json')}"></ul>`,
      false,
    )

    let val = this._data.val

    try {
      if (isStr(val)) {
        val = JSON.parse(val)
      }
    } catch {
      // No op
    }

    const objViewer = (this._objViewer = new LunaObjectViewer(
      this._$el.find('.eruda-json').get(0),
      {
        unenumerable: true,
        accessGetter: true,
        prototype: false,
      },
    ))
    objViewer.set(val)
    this._indexObjectNodes()
    objViewer.on('change', this._indexObjectNodes)
  }
  _destroyObjViewer() {
    if (!this._objViewer) return

    this._objViewer.destroy()
    this._objViewer = null
    this._sourceObjects = new WeakMap()
  }
  _indexObjectNodes = () => {
    const objViewer = this._objViewer
    if (!objViewer) return

    const root = this._$el.find(c('.json')).get(0)
    const nodes = root.querySelectorAll('li[data-object-id]')
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i]
      const id = node.getAttribute('data-object-id')
      if (Object.prototype.hasOwnProperty.call(objViewer.map, id)) {
        this._sourceObjects.set(node, objViewer.map[id])
      }
    }
  }
  _scheduleObjectSearch = () => {
    if (this._searchTimer !== null) clearTimeout(this._searchTimer)

    this._searchTimer = setTimeout(() => {
      this._searchTimer = null
      this._applyObjectSearch()
    }, SEARCH_DELAY)
  }
  _onSearchKeydown = (event) => {
    const originalEvent = event.origEvent
    if (originalEvent.key !== 'Enter') return

    event.preventDefault()
    this._moveObjectSearch(originalEvent.shiftKey ? -1 : 1)
  }
  _searchPrevious = () => this._moveObjectSearch(-1)
  _searchNext = () => this._moveObjectSearch(1)
  _moveObjectSearch(step) {
    if (this._searchMatches.length === 0) return

    this._selectObjectSearchMatch(this._searchIndex + step)
  }
  _resetObjectSearch() {
    if (this._searchTimer !== null) {
      clearTimeout(this._searchTimer)
      this._searchTimer = null
    }
    this._searchMatches = []
    this._searchIndex = -1
    this._searchTotal = 0
    this._searchLimited = false
  }
  _clearObjectSearchHighlights() {
    const root = this._$el.get(0)
    const matches = root.querySelectorAll(c('.source-search-match'))
    const parents = []

    for (let i = 0, len = matches.length; i < len; i++) {
      const match = matches[i]
      const parent = match.parentNode
      parent.replaceChild(document.createTextNode(match.textContent), match)
      if (parents.indexOf(parent) < 0) parents.push(parent)
    }
    for (let i = 0, len = parents.length; i < len; i++) {
      parents[i].normalize()
    }
  }
  /**
   * Expand only object branches containing a match. Data properties are read
   * through descriptors so searching never invokes application getters.
   */
  _expandObjectSearchMatches(keyword) {
    const root = this._$el.find(c('.json')).get(0)
    const matcher = new RegExp(escapeRegExp(keyword), 'i')
    const state = {
      cache: new WeakMap(),
      propertyCount: 0,
      limited: false,
    }
    const visited = new WeakSet()

    this._expandObjectList(root, matcher, state, visited)
    if (state.limited) this._searchLimited = true
  }
  _expandObjectList(list, matcher, state, visited) {
    const items = list.children
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i]
      if (item.tagName !== 'LI') continue

      const childList = findDirectChild(item, 'UL')
      if (!childList) continue

      const value = this._sourceObjects.get(item)
      if (item.hasAttribute('data-first-level')) {
        if (isObjectLike(value)) visited.add(value)
        this._expandObjectList(childList, matcher, state, visited)
        continue
      }
      if (!isObjectLike(value) || visited.has(value)) continue
      visited.add(value)

      if (!objectContainsKeyword(value, matcher, state)) continue

      const toggle = findDirectChild(item, '.luna-object-viewer-expanded')
      if (toggle && toggle.classList.contains('luna-object-viewer-collapsed')) {
        item.click()
      }
      this._expandObjectList(childList, matcher, state, visited)
    }
  }
  /** Highlight visible object-viewer text after matching branches are open. */
  _highlightObjectSearchMatches(keyword) {
    const root = this._$el.find(c('.json')).get(0)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const textNodes = []
    let visitedCount = 0
    let textNode = walker.nextNode()

    while (textNode && visitedCount < MAX_SOURCE_SEARCH_NODES) {
      visitedCount++
      if (isVisibleObjectText(textNode, root)) textNodes.push(textNode)
      textNode = walker.nextNode()
    }
    if (textNode) this._searchLimited = true

    const matcher = new RegExp(escapeRegExp(keyword), 'gi')
    let highlightedCount = 0
    for (let i = 0, len = textNodes.length; i < len; i++) {
      const node = textNodes[i]
      const text = node.nodeValue
      const ranges = []
      let match = matcher.exec(text)

      while (match) {
        this._searchTotal++
        if (highlightedCount < MAX_SOURCE_SEARCH_MATCHES) {
          ranges.push([match.index, match.index + match[0].length])
          highlightedCount++
        }
        match = matcher.exec(text)
      }
      matcher.lastIndex = 0

      if (ranges.length === 0) continue

      const fragment = document.createDocumentFragment()
      let offset = 0
      for (let j = 0, rangeLen = ranges.length; j < rangeLen; j++) {
        const range = ranges[j]
        fragment.appendChild(
          document.createTextNode(text.slice(offset, range[0])),
        )

        const mark = document.createElement('mark')
        mark.className = c('source-search-match')
        mark.textContent = text.slice(range[0], range[1])
        fragment.appendChild(mark)
        offset = range[1]
      }
      fragment.appendChild(document.createTextNode(text.slice(offset)))
      node.parentNode.replaceChild(fragment, node)
    }
  }
  _applyObjectSearch() {
    if (this._searchTimer !== null) {
      clearTimeout(this._searchTimer)
      this._searchTimer = null
    }

    this._clearObjectSearchHighlights()
    this._searchMatches = []
    this._searchIndex = -1
    this._searchTotal = 0
    this._searchLimited = false

    const input = this._$el.find(c('.source-search-input')).get(0)
    if (!input || !this._objViewer) return

    const keyword = trim(input.value)
    if (keyword === '') {
      this._renderObjectSearchStatus()
      return
    }

    this._expandObjectSearchMatches(keyword)
    this._highlightObjectSearchMatches(keyword)

    const root = this._$el.find(c('.json')).get(0)
    this._searchMatches = Array.prototype.slice.call(
      root.querySelectorAll(c('.source-search-match')),
    )
    if (this._searchMatches.length > 0) {
      this._selectObjectSearchMatch(0)
    } else {
      this._renderObjectSearchStatus()
    }
  }
  _selectObjectSearchMatch(index) {
    const len = this._searchMatches.length
    if (len === 0) return

    const normalizedIndex = ((index % len) + len) % len
    for (let i = 0; i < len; i++) {
      this._searchMatches[i].classList.remove(c('source-search-match-active'))
    }

    const match = this._searchMatches[normalizedIndex]
    match.classList.add(c('source-search-match-active'))
    this._searchIndex = normalizedIndex

    const source = this._$el.get(0)
    const search = this._$el.find(c('.source-search')).get(0)
    const sourceRect = source.getBoundingClientRect()
    const matchRect = match.getBoundingClientRect()
    const searchHeight = search ? search.offsetHeight : 0
    const visibleHeight = Math.max(0, source.clientHeight - searchHeight)
    const matchTop = source.scrollTop + matchRect.top - sourceRect.top

    /** Scroll Sources only; never move the inspected page itself. */
    source.scrollTop = Math.max(
      0,
      matchTop - searchHeight - (visibleHeight - matchRect.height) / 2,
    )
    this._renderObjectSearchStatus()
  }
  _renderObjectSearchStatus() {
    const len = this._searchMatches.length
    const current = len === 0 ? 0 : this._searchIndex + 1
    const limited = this._searchLimited || this._searchTotal > len
    const total = limited ? `${len}+` : this._searchTotal
    const $count = this._$el.find(c('.source-search-count'))
    const $buttons = this._$el.find(c('.source-search-button'))

    $count.text(`${current}/${total}`)
    $count.attr(
      'title',
      limited ? 'Search stopped at the safe result limit' : '',
    )
    if (len === 0) {
      $buttons.attr('disabled', 'disabled')
    } else {
      $buttons.rmAttr('disabled')
    }
  }
  _renderRaw() {
    const data = this._data

    this._renderHtml(`<div class="${c('raw-wrapper')}">
      <div class="${c('raw')}"></div>
    </div>`)

    let val = data.val
    const container = this._$el.find(c('.raw')).get(0)
    if (val.length > MAX_RAW_LEN) {
      val = truncate(val, MAX_RAW_LEN)
    }

    new LunaTextViewer(container, {
      text: val,
      wrapLongLines: true,
      showLineNumbers: val.length < MAX_LINE_NUM_LEN && this._showLineNum,
    })
  }
  _renderIframe() {
    this._renderHtml(`<iframe src="${escape(this._data.val)}"></iframe>`)
  }
  _renderHtml(html, cache = true) {
    if (cache && html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
    // Need setTimeout to make it work
    setTimeout(() => (this._$el.get(0).scrollTop = 0), 0)
  }
}

const MAX_BEAUTIFY_LEN = 30000
const MAX_LINE_NUM_LEN = 80000
const MAX_RAW_LEN = 100000
const MAX_SOURCE_SEARCH_MATCHES = 200
const MAX_SOURCE_SEARCH_NODES = 10000
const MAX_SOURCE_SEARCH_DEPTH = 100
const SEARCH_DELAY = 120

function findDirectChild(parent, selector) {
  const children = parent.children
  for (let i = 0, len = children.length; i < len; i++) {
    if (children[i].matches(selector)) return children[i]
  }

  return null
}

function isObjectLike(value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

/**
 * Check enumerable data properties without evaluating accessors. The shared
 * counter bounds work across every branch expanded for a single query.
 */
function objectContainsKeyword(value, matcher, state, depth = 0) {
  if (!isObjectLike(value)) return matcher.test(String(value))
  if (depth >= MAX_SOURCE_SEARCH_DEPTH) {
    state.limited = true
    return false
  }
  if (state.cache.has(value)) return state.cache.get(value)

  state.cache.set(value, false)

  let keys
  try {
    keys = Object.keys(value)
  } catch {
    return false
  }

  for (let i = 0, len = keys.length; i < len; i++) {
    if (state.propertyCount >= MAX_SOURCE_SEARCH_NODES) {
      state.limited = true
      return false
    }
    state.propertyCount++

    const key = keys[i]
    if (matcher.test(key)) {
      state.cache.set(value, true)
      return true
    }

    let descriptor
    try {
      descriptor = Object.getOwnPropertyDescriptor(value, key)
    } catch {
      continue
    }
    if (
      !descriptor ||
      !Object.prototype.hasOwnProperty.call(descriptor, 'value')
    ) {
      continue
    }

    if (objectContainsKeyword(descriptor.value, matcher, state, depth + 1)) {
      state.cache.set(value, true)
      return true
    }
  }

  return false
}

function isVisibleObjectText(node, root) {
  let element = node.parentElement
  while (element && element !== root) {
    if (element.tagName === 'UL' && element.style.display === 'none') {
      return false
    }
    element = element.parentElement
  }

  return true
}
