import trim from 'licia/trim'
import isEmpty from 'licia/isEmpty'
import map from 'licia/map'
import each from 'licia/each'
import escape from 'licia/escape'
import copy from 'licia/copy'
import isJson from 'licia/isJson'
import escapeRegExp from 'licia/escapeRegExp'
import Emitter from 'licia/Emitter'
import truncate from 'licia/truncate'
import { classPrefix as c } from '../lib/util'

export default class Detail extends Emitter {
  constructor($container, devtools) {
    super()
    this._$container = $container
    this._devtools = devtools

    this._detailData = {}
    this._searchTimer = null
    this._searchMatches = []
    this._searchIndex = -1
    this._searchTotal = 0
    this._bindEvent()
  }
  show(data) {
    this._resetSearch()

    if (data.resTxt && trim(data.resTxt) === '') {
      delete data.resTxt
    }
    if (isEmpty(data.resHeaders)) {
      delete data.resHeaders
    }
    if (isEmpty(data.reqHeaders)) {
      delete data.reqHeaders
    }

    let postData = ''
    if (data.data) {
      postData = `<pre class="${c('data')}">${escape(
        formatBody(data.data),
      )}</pre>`
    }

    let reqHeaders = '<tr><td>Empty</td></tr>'
    if (data.reqHeaders) {
      reqHeaders = map(data.reqHeaders, (val, key) => {
        return `<tr>
          <td class="${c('key')}">${escape(key)}</td>
          <td>${escape(val)}</td>
        </tr>`
      }).join('')
    }

    let resHeaders = '<tr><td>Empty</td></tr>'
    if (data.resHeaders) {
      resHeaders = map(data.resHeaders, (val, key) => {
        return `<tr>
          <td class="${c('key')}">${escape(key)}</td>
          <td>${escape(val)}</td>
        </tr>`
      }).join('')
    }

    let resTxt = ''
    if (data.resTxt) {
      resTxt = `<pre class="${c('response')}">${escape(
        formatBody(data.resTxt),
      )}</pre>`
    }

    const html = `<div class="${c('control')}">
      <span class="${c('icon-left back')}"></span>
      <span class="${c('icon-delete back')}"></span>
      <span class="${c('url')}">${escape(data.url)}</span>
      <span class="${c(
        'icon-caret-down copy-menu-toggle',
      )}" title="Copy options" aria-label="Copy options"></span>
      <div class="${c('copy-menu')}" role="menu">
        ${this._renderCopyMenu(data)}
      </div>
    </div>
    <div class="${c('detail-search')}" role="search">
      <span class="${c('icon-search detail-search-icon')}" aria-hidden="true"></span>
      <input class="${c(
        'detail-search-input',
      )}" type="search" placeholder="Find in details" aria-label="Find in network details" autocomplete="off" spellcheck="false">
      <span class="${c('detail-search-count')}" aria-live="polite">0/0</span>
      <button class="${c(
        'detail-search-button detail-search-prev',
      )}" type="button" title="Previous match" aria-label="Previous match" disabled>&uarr;</button>
      <button class="${c(
        'detail-search-button detail-search-next',
      )}" type="button" title="Next match" aria-label="Next match" disabled>&darr;</button>
    </div>
    <div class="${c('http')}">
      ${postData}
      <div class="${c('section')}">
        <h2>Response Headers</h2>
        <table class="${c('headers')}">
          <tbody>
            ${resHeaders}
          </tbody>
        </table>
      </div>
      <div class="${c('section')}">
        <h2>Request Headers</h2>
        <table class="${c('headers')}">
          <tbody>
            ${reqHeaders}
          </tbody>
        </table>
      </div>
      ${resTxt}
    </div>`

    this._$container.html(html).show()
    this._detailData = data
  }
  hide() {
    this._resetSearch()
    this._hideCopyMenu()
    this._$container.hide()
    this.emit('hide')
  }
  _renderCopyMenu(data) {
    return map(COPY_OPTIONS, (option) => {
      const disabled = getCopyText(data, option.field) === ''
      const disabledClass = disabled ? ` ${c('copy-menu-item-disabled')}` : ''

      return `<div class="${c(
        'copy-menu-item',
      )}${disabledClass}" data-copy-field="${option.field}" role="menuitem" aria-disabled="${disabled}">${option.label}</div>`
    }).join('')
  }
  _copyField = (event) => {
    this._copy(event.curTarget.getAttribute('data-copy-field'))
  }
  _copy(field) {
    const data = getCopyText(this._detailData, field)
    if (data === '') return

    copy(data)
    this._hideCopyMenu()
    this._devtools.notify('Copied', { icon: 'success' })
  }
  _toggleCopyMenu = () => {
    this._$container.find(c('.copy-menu')).toggleClass(c('copy-menu-visible'))
    this._$container.find(c('.copy-menu-toggle')).toggleClass(c('active'))
  }
  _hideCopyMenu = () => {
    this._$container.find(c('.copy-menu')).rmClass(c('copy-menu-visible'))
    this._$container.find(c('.copy-menu-toggle')).rmClass(c('active'))
  }
  _scheduleSearch = () => {
    if (this._searchTimer !== null) clearTimeout(this._searchTimer)

    this._searchTimer = setTimeout(() => {
      this._searchTimer = null
      this._applySearch()
    }, SEARCH_DELAY)
  }
  _onSearchKeydown = (event) => {
    const originalEvent = event.origEvent
    if (originalEvent.key !== 'Enter') return

    event.preventDefault()
    this._moveSearch(originalEvent.shiftKey ? -1 : 1)
  }
  _searchPrevious = () => this._moveSearch(-1)
  _searchNext = () => this._moveSearch(1)
  _moveSearch(step) {
    if (this._searchMatches.length === 0) return

    this._selectSearchMatch(this._searchIndex + step)
  }
  _resetSearch() {
    if (this._searchTimer !== null) {
      clearTimeout(this._searchTimer)
      this._searchTimer = null
    }
    this._searchMatches = []
    this._searchIndex = -1
    this._searchTotal = 0
  }
  _clearSearchHighlights() {
    const root = this._$container.get(0)
    const matches = root.querySelectorAll(c('.detail-search-match'))
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
   * Search only when the user types. Text is scanned once, while DOM highlights
   * are capped so a one-character query cannot create thousands of elements.
   */
  _applySearch() {
    if (this._searchTimer !== null) {
      clearTimeout(this._searchTimer)
      this._searchTimer = null
    }

    this._clearSearchHighlights()
    this._searchMatches = []
    this._searchIndex = -1
    this._searchTotal = 0

    const input = this._$container.find(c('.detail-search-input')).get(0)
    const keyword = trim(input.value)
    if (keyword === '') {
      this._renderSearchStatus()
      return
    }

    const root = this._$container.find(c('.http')).get(0)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const textNodes = []
    let textNode = walker.nextNode()
    while (textNode) {
      textNodes.push(textNode)
      textNode = walker.nextNode()
    }

    const matcher = new RegExp(escapeRegExp(keyword), 'gi')
    let highlightedCount = 0
    for (let i = 0, len = textNodes.length; i < len; i++) {
      const node = textNodes[i]
      const text = node.nodeValue
      const ranges = []
      let match = matcher.exec(text)

      while (match) {
        this._searchTotal++
        if (highlightedCount < MAX_SEARCH_MATCHES) {
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
        mark.className = c('detail-search-match')
        mark.textContent = text.slice(range[0], range[1])
        fragment.appendChild(mark)
        offset = range[1]
      }
      fragment.appendChild(document.createTextNode(text.slice(offset)))
      node.parentNode.replaceChild(fragment, node)
    }

    this._searchMatches = Array.prototype.slice.call(
      root.querySelectorAll(c('.detail-search-match')),
    )
    if (this._searchMatches.length > 0) {
      this._selectSearchMatch(0)
    } else {
      this._renderSearchStatus()
    }
  }
  _selectSearchMatch(index) {
    const len = this._searchMatches.length
    if (len === 0) return

    const normalizedIndex = ((index % len) + len) % len
    for (let i = 0; i < len; i++) {
      this._searchMatches[i].classList.remove(c('detail-search-match-active'))
    }

    const match = this._searchMatches[normalizedIndex]
    match.classList.add(c('detail-search-match-active'))
    this._searchIndex = normalizedIndex

    const http = this._$container.find(c('.http')).get(0)
    const httpRect = http.getBoundingClientRect()
    const matchRect = match.getBoundingClientRect()
    const matchTop = http.scrollTop + matchRect.top - httpRect.top

    /** Scroll the Network detail only; never move the inspected page itself. */
    http.scrollTop = Math.max(
      0,
      matchTop - (http.clientHeight - matchRect.height) / 2,
    )
    this._renderSearchStatus()
  }
  _renderSearchStatus() {
    const len = this._searchMatches.length
    const current = len === 0 ? 0 : this._searchIndex + 1
    const limited = this._searchTotal > len
    const total = limited ? `${len}+` : this._searchTotal
    const $count = this._$container.find(c('.detail-search-count'))
    const $buttons = this._$container.find(c('.detail-search-button'))

    $count.text(`${current}/${total}`)
    $count.attr(
      'title',
      limited ? `Showing the first ${len} of ${this._searchTotal} matches` : '',
    )
    if (len === 0) {
      $buttons.attr('disabled', 'disabled')
    } else {
      $buttons.rmAttr('disabled')
    }
  }
  _bindEvent() {
    const devtools = this._devtools

    this._$container
      .on('click', c('.back'), () => this.hide())
      .on('click', c('.copy-menu-toggle'), this._toggleCopyMenu)
      .on('click', c('.copy-menu-item'), this._copyField)
      .on('click', c('.http'), this._hideCopyMenu)
      .on('input', c('.detail-search-input'), this._scheduleSearch)
      .on('keydown', c('.detail-search-input'), this._onSearchKeydown)
      .on('click', c('.detail-search-prev'), this._searchPrevious)
      .on('click', c('.detail-search-next'), this._searchNext)
      .on('click', c('.http .data'), () => {
        const requestData = this._detailData.data
        if (!requestData) return

        showSources(isJson(requestData) ? 'object' : 'raw', requestData)
      })
      .on('click', c('.http .response'), () => {
        const data = this._detailData
        const resTxt = data.resTxt

        if (isJson(resTxt)) {
          return showSources('object', resTxt)
        }

        switch (data.subType) {
          case 'css':
            return showSources('css', resTxt)
          case 'html':
            return showSources('html', resTxt)
          case 'javascript':
            return showSources('js', resTxt)
          case 'json':
            return showSources('object', resTxt)
        }
        switch (data.type) {
          case 'image':
            return showSources('img', data.url)
        }
      })

    const showSources = (type, data) => {
      const sources = devtools.get('sources')
      if (!sources) {
        return
      }

      sources.set(type, data)

      devtools.showTool('sources')
    }
  }
}

const MAX_BODY_LEN = 100000
const MAX_SEARCH_MATCHES = 200
const SEARCH_DELAY = 120

const COPY_OPTIONS = [
  { field: 'all', label: 'Copy All' },
  { field: 'url', label: 'Request URL' },
  { field: 'query', label: 'Query Parameters' },
  { field: 'requestBody', label: 'Request Body' },
  { field: 'requestHeaders', label: 'Request Headers' },
  { field: 'responseHeaders', label: 'Response Headers' },
  { field: 'responseBody', label: 'Response Body' },
]

/**
 * Pretty-print JSON for display without ever changing the captured raw body.
 * Parsing is bounded to keep opening a detail view predictable for large data.
 */
function formatBody(body) {
  const text = String(body)
  if (text.length > MAX_BODY_LEN) return truncate(text, MAX_BODY_LEN)

  try {
    const formatted = JSON.stringify(JSON.parse(text), null, 2)
    return formatted.length > MAX_BODY_LEN
      ? truncate(formatted, MAX_BODY_LEN)
      : formatted
  } catch {
    return text
  }
}

/**
 * Return the exact query string without decoding or changing parameter order.
 */
function getQueryString(url) {
  const queryStart = url.indexOf('?')
  const hashStart = url.indexOf('#')
  if (queryStart < 0 || (hashStart >= 0 && queryStart > hashStart)) return ''

  return url.slice(queryStart + 1, hashStart < 0 ? url.length : hashStart)
}

/**
 * Format headers in the same readable form used by the legacy copy-all output.
 */
function formatHeaders(headers) {
  const lines = []
  each(headers, (val, key) => lines.push(`${key}: ${val}`))
  return lines.join('\n')
}

/**
 * Build the legacy full payload byte-for-byte so the original copy action stays
 * backward compatible.
 */
function formatAll(detailData) {
  let data = `${detailData.method} ${detailData.url} ${detailData.status}\n`
  if (!isEmpty(detailData.data)) {
    data += '\nRequest Data\n\n'
    data += `${detailData.data}\n`
  }
  if (!isEmpty(detailData.reqHeaders)) {
    data += '\nRequest Headers\n\n'
    each(detailData.reqHeaders, (val, key) => (data += `${key}: ${val}\n`))
  }
  if (!isEmpty(detailData.resHeaders)) {
    data += '\nResponse Headers\n\n'
    each(detailData.resHeaders, (val, key) => (data += `${key}: ${val}\n`))
  }
  if (detailData.resTxt) {
    data += `\n${detailData.resTxt}\n`
  }

  return data
}

/**
 * Resolve one copy option without mutating the captured network request.
 */
function getCopyText(detailData, field) {
  switch (field) {
    case 'all':
      return formatAll(detailData)
    case 'url':
      return detailData.url || ''
    case 'query':
      return getQueryString(detailData.url || '')
    case 'requestBody':
      return detailData.data == null ? '' : String(detailData.data)
    case 'requestHeaders':
      return formatHeaders(detailData.reqHeaders || {})
    case 'responseHeaders':
      return formatHeaders(detailData.resHeaders || {})
    case 'responseBody':
      return detailData.resTxt == null ? '' : String(detailData.resTxt)
    default:
      return ''
  }
}
