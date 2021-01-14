import Log from './Log'
import {
  Emitter,
  isNum,
  isUndef,
  perfNow,
  now,
  isStr,
  extend,
  uniqId,
  isRegExp,
  isFn,
  $,
  Stack,
  isEmpty,
  contain,
  copy,
  each,
  toArr,
  keys,
  last,
  throttle,
  raf,
  xpath,
  isHidden,
  lowerCase,
  dateFormat,
} from '../lib/util'
import evalCss from '../lib/evalCss'

const u = navigator.userAgent
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1

let id = 0
let _eval = () => {}
!(() => {
  _eval = (jsInput) => {
    let ret
    try {
      ret = eval.call(window, `(${jsInput})`)
    } catch (e) {
      ret = eval.call(window, jsInput)
    }
    return ret
  }
})()

export default class Logger extends Emitter {
  constructor($container) {
    super()
    this._style = evalCss(require('./Logger.scss'))

    this._$container = $container
    this._container = $container.get(0)
    this._$el = $container.find('.eruda-logs')
    this._el = this._$el.get(0)
    this._$fakeEl = $container.find('.eruda-fake-logs')
    this._fakeEl = this._$fakeEl.get(0)
    this._$space = $container.find('.eruda-logs-space')
    this._space = this._$space.get(0)
    this._spaceHeight = 0
    this._topSpaceHeight = 0
    this._bottomSpaceHeight = 0
    this._lastScrollTop = 0
    this._lastTimestamp = 0
    this._speedToleranceFactor = 100
    this._maxSpeedTolerance = 2000
    this._minSpeedTolerance = 100
    this._logs = []
    this._displayLogs = []
    this._timer = {}
    this._count = {}
    this._lastLog = {}
    this._filter = 'all'
    this._maxNum = 'infinite'
    this._displayHeader = false
    this._asyncRender = false
    this._asyncList = []
    this._asyncTimer = null
    this._isAtBottom = true
    this._groupStack = new Stack()

    // For android slowing rendering
    if (isAndroid) {
      this._speedToleranceFactor = 800
      this._maxSpeedTolerance = 3000
      this._minSpeedTolerance = 800
    }

    this.renderViewport = throttle((options) => {
      this._renderViewport(options)
    }, 16)

    // https://developers.google.cn/web/tools/chrome-devtools/console/utilities
    this._global = {
      copy(value) {
        if (!isStr(value)) value = JSON.stringify(value, null, 2)
        copy(value)
      },
      $() {
        return document.querySelector.apply(document, arguments)
      },
      $$() {
        return toArr(document.querySelectorAll.apply(document, arguments))
      },
      $x(path) {
        return xpath(path)
      },
      clear: () => {
        this.clear()
      },
      dir: (value) => {
        this.dir(value)
      },
      table: (data, columns) => {
        this.table(data, columns)
      },
      keys,
    }

    this._bindEvent()
  }
  renderAsync(flag) {
    this._asyncRender = flag
  }
  setGlobal(name, val) {
    this._global[name] = val
  }
  displayHeader(flag) {
    this._displayHeader = flag
  }
  maxNum(val) {
    const logs = this._logs

    this._maxNum = val
    if (isNum(val) && logs.length > val) {
      this._logs = logs.slice(logs.length - val)
      this.render()
    }
  }
  displayUnenumerable(flag) {
    Log.showUnenumerable = flag
  }
  displayGetterVal(flag) {
    Log.showGetterVal = flag
  }
  lazyEvaluation(flag) {
    Log.lazyEvaluation = flag
  }
  viewLogInSources(flag) {
    Log.showSrcInSources = flag
  }
  destroy() {
    if (this._style) {
      evalCss.remove(this._style)
    }
  }
  filter(val) {
    this._filter = val
    this.emit('filter', val)

    return this.render()
  }
  count(label = 'default') {
    const count = this._count

    !isUndef(count[label]) ? count[label]++ : (count[label] = 1)

    return this.info(`${label}: ${count[label]}`)
  }
  countReset(label = 'default') {
    this._count[label] = 0

    return this
  }
  assert(...args) {
    if (isEmpty(args)) return

    const exp = args.shift()

    if (!exp) {
      if (args.length === 0) args.unshift('console.assert')
      args.unshift('Assertion failed: ')
      return this.insert('error', args)
    }
  }
  log(...args) {
    if (isEmpty(args)) return

    return this.insert('log', args)
  }
  debug(...args) {
    if (isEmpty(args)) return

    return this.insert('debug', args)
  }
  dir(obj) {
    if (isUndef(obj)) return

    return this.insert('dir', [obj])
  }
  table(...args) {
    if (isEmpty(args)) return

    return this.insert('table', args)
  }
  time(name = 'default') {
    if (this._timer[name]) {
      return this.insert('warn', [`Timer '${name}' already exists`])
    }
    this._timer[name] = perfNow()

    return this
  }
  timeLog(name = 'default') {
    const startTime = this._timer[name]

    if (!startTime) {
      return this.insert('warn', [`Timer '${name}' does not exist`])
    }

    return this.info(`${name}: ${perfNow() - startTime}ms`)
  }
  timeEnd(name = 'default') {
    this.timeLog(name)

    delete this._timer[name]

    return this
  }
  clear() {
    this.silentClear()

    return this.insert('log', [
      '%cConsole was cleared',
      'color:#808080;font-style:italic;',
    ])
  }
  silentClear() {
    this._logs = []
    this._displayLogs = []
    this._lastLog = {}
    this._count = {}
    this._timer = {}
    this._groupStack = new Stack()
    this._asyncList = []
    if (this._asyncTimer) {
      clearTimeout(this._asyncTimer)
      this._asyncTimer = null
    }

    return this.render()
  }
  info(...args) {
    if (isEmpty(args)) return

    return this.insert('info', args)
  }
  error(...args) {
    if (isEmpty(args)) return

    return this.insert('error', args)
  }
  warn(...args) {
    if (isEmpty(args)) return

    return this.insert('warn', args)
  }
  group(...args) {
    return this.insert({
      type: 'group',
      args,
      ignoreFilter: true,
    })
  }
  groupCollapsed(...args) {
    return this.insert({
      type: 'groupCollapsed',
      args,
      ignoreFilter: true,
    })
  }
  groupEnd() {
    this.insert('groupEnd')
  }
  input(jsCode) {
    this.insert({
      type: 'input',
      args: [jsCode],
      ignoreFilter: true,
    })

    try {
      this.output(this._evalJs(jsCode))
    } catch (e) {
      this.insert({
        type: 'error',
        ignoreFilter: true,
        args: [e],
      })
    }

    return this
  }
  output(val) {
    return this.insert({
      type: 'output',
      args: [val],
      ignoreFilter: true,
    })
  }
  html(...args) {
    return this.insert('html', args)
  }
  render() {
    const logs = this._logs

    this._$el.html('')
    this._isAtBottom = true
    this._updateBottomSpace(0)
    this._updateTopSpace(0)
    this._displayLogs = []
    for (let i = 0, len = logs.length; i < len; i++) {
      this._attachLog(logs[i])
    }

    return this
  }
  insert(type, args) {
    let headers
    if (this._displayHeader) {
      headers = {
        time: getCurTime(),
        from: getFrom(),
      }
    }

    this._asyncRender
      ? this.insertAsync(type, args, headers)
      : this.insertSync(type, args, headers)
  }
  insertAsync(type, args, headers) {
    this._asyncList.push([type, args, headers])

    this._handleAsyncList()
  }
  insertSync(type, args, headers) {
    const logs = this._logs
    const groupStack = this._groupStack

    // Because asynchronous rendering, groupEnd must be put here.
    if (type === 'groupEnd') {
      const lastLog = this._lastLog
      lastLog.groupEnd()
      this._groupStack.pop()
      return this
    }

    const options = isStr(type) ? { type, args } : type
    if (groupStack.size > 0) {
      options.group = groupStack.peek()
    }
    extend(options, {
      id: ++id,
      headers,
    })

    if (options.type === 'group' || options.type === 'groupCollapsed') {
      const group = {
        id: uniqId('group'),
        collapsed: false,
        parent: groupStack.peek(),
        indentLevel: groupStack.size + 1,
      }
      if (options.type === 'groupCollapsed') group.collapsed = true
      options.targetGroup = group
      groupStack.push(group)
    }

    let log = new Log(options)
    log.on('updateSize', () => {
      this._isAtBottom = false
      this.renderViewport()
    })

    const lastLog = this._lastLog
    if (
      !contain(['html', 'group', 'groupCollapsed'], log.type) &&
      lastLog.type === log.type &&
      !log.src &&
      !log.args &&
      lastLog.text() === log.text()
    ) {
      lastLog.addCount()
      if (log.time) lastLog.updateTime(log.time)
      log = lastLog
      this._detachLog(lastLog)
    } else {
      logs.push(log)
      this._lastLog = log
    }

    if (this._maxNum !== 'infinite' && logs.length > this._maxNum) {
      const firstLog = logs[0]
      this._detachLog(firstLog)
      logs.shift()
    }

    this._attachLog(log)

    this.emit('insert', log)

    return this
  }
  toggleGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed ? this._openGroup(log) : this._collapseGroup(log)
  }
  _updateTopSpace(height) {
    this._topSpaceHeight = height
    this._el.style.top = height + 'px'
  }
  _updateBottomSpace(height) {
    this._bottomSpaceHeight = height
  }
  _updateSpace(height) {
    if (this._spaceHeight === height) return
    this._spaceHeight = height
    this._space.style.height = height + 'px'
  }
  _updateLogSize(log) {
    const fakeEl = this._fakeEl
    if (isHidden(this._fakeEl)) return
    if (!log.isAttached()) {
      fakeEl.appendChild(log.el)
      log.updateSize()
      if (fakeEl.children > 100) {
        fakeEl.innerHTML = ''
      }
      return
    }
    log.updateSize()
  }
  _detachLog(log) {
    const displayLogs = this._displayLogs

    const idx = displayLogs.indexOf(log)
    if (idx > -1) {
      displayLogs.splice(idx, 1)
      this.renderViewport()
    }
  }
  // Binary search
  _attachLog(log) {
    if (!this._filterLog(log) || log.collapsed) return

    const displayLogs = this._displayLogs

    if (displayLogs.length === 0) {
      displayLogs.push(log)
      this.renderViewport()
      return
    }

    const lastDisplayLog = last(displayLogs)
    if (log.id > lastDisplayLog.id) {
      displayLogs.push(log)
      this.renderViewport()
      return
    }

    let startIdx = 0
    let endIdx = displayLogs.length - 1

    let middleLog
    let middleIdx

    while (startIdx <= endIdx) {
      middleIdx = startIdx + Math.floor((endIdx - startIdx) / 2)
      middleLog = displayLogs[middleIdx]

      if (middleLog.id === log.id) {
        return
      }

      if (middleLog.id < log.id) {
        startIdx = middleIdx + 1
      } else {
        endIdx = middleIdx - 1
      }
    }

    if (middleLog.id < log.id) {
      displayLogs.splice(middleIdx + 1, 0, log)
    } else {
      displayLogs.splice(middleIdx, 0, log)
    }

    this.renderViewport()
  }
  _handleAsyncList(timeout = 20) {
    const asyncList = this._asyncList

    if (this._asyncTimer) return

    this._asyncTimer = setTimeout(() => {
      this._asyncTimer = null
      let done = false
      const len = asyncList.length
      // insert faster if logs is huge, thus takes more time to render.
      let timeout, num
      if (len < 1000) {
        num = 200
        timeout = 400
      } else if (len < 5000) {
        num = 500
        timeout = 800
      } else if (len < 10000) {
        num = 800
        timeout = 1000
      } else if (len < 25000) {
        num = 1000
        timeout = 1200
      } else if (len < 50000) {
        num = 1500
        timeout = 1500
      } else {
        num = 2000
        timeout = 2500
      }
      if (num > len) {
        num = len
        done = true
      }
      for (let i = 0; i < num; i++) {
        const [type, args, headers] = asyncList.shift()
        this.insertSync(type, args, headers)
      }
      if (!done) raf(() => this._handleAsyncList(timeout))
    }, timeout)
  }
  _injectGlobal() {
    each(this._global, (val, name) => {
      if (window[name]) return

      window[name] = val
    })
  }
  _clearGlobal() {
    each(this._global, (val, name) => {
      if (window[name] && window[name] === val) {
        delete window[name]
      }
    })
  }
  _evalJs(jsInput) {
    this._injectGlobal()
    const ret = _eval(jsInput)
    this.setGlobal('$_', ret)
    this._clearGlobal()

    return ret
  }
  _filterLog(log) {
    const filter = this._filter

    if (filter === 'all') return true

    const isFilterRegExp = isRegExp(filter)
    const isFilterFn = isFn(filter)

    if (log.ignoreFilter) return true
    if (isFilterFn) return filter(log)
    if (isFilterRegExp) return filter.test(lowerCase(log.text()))

    return log.type === filter
  }
  _getLog(id) {
    const logs = this._logs
    let log

    for (let i = 0, len = logs.length; i < len; i++) {
      log = logs[i]
      if (log.id === id) break
    }

    return log
  }
  _collapseGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed = true
    log.updateIcon('caret-right')

    this._updateGroup(log)
  }
  _openGroup(log) {
    const { targetGroup } = log
    targetGroup.collapsed = false
    log.updateIcon('caret-down')

    this._updateGroup(log)
  }
  _updateGroup(log) {
    const { targetGroup } = log
    const logs = this._logs
    const len = logs.length
    let i = logs.indexOf(log) + 1
    while (i < len) {
      const log = logs[i]
      if (!log.checkGroup() && log.group === targetGroup) {
        break
      }
      log.collapsed ? this._detachLog(log) : this._attachLog(log)
      i++
    }
  }
  _bindEvent() {
    const self = this
    const $el = this._$el

    $el
      .on('click', '.eruda-log-container', function () {
        this.log.click(self)
      })
      .on('click', '.eruda-icon-caret-down', function () {
        const $el = $(this).parent().parent().parent()

        self._collapseGroup($el.get(0).log)
      })
      .on('click', '.eruda-icon-caret-right', function () {
        const $el = $(this).parent().parent().parent()

        self._openGroup($el.get(0).log)
      })

    this._$container.on('scroll', () => {
      const { scrollHeight, offsetHeight, scrollTop } = this._container
      // safari bounce effect
      if (scrollTop <= 0) return
      if (offsetHeight + scrollTop > scrollHeight) return

      let isAtBottom = false
      if (scrollHeight === offsetHeight) {
        isAtBottom = true
      } else if (scrollTop === scrollHeight - offsetHeight) {
        isAtBottom = true
      }
      this._isAtBottom = isAtBottom

      const lastScrollTop = this._lastScrollTop
      const lastTimestamp = this._lastTimestamp

      const timestamp = now()
      const duration = timestamp - lastTimestamp
      const distance = scrollTop - lastScrollTop
      const speed = Math.abs(distance / duration)
      let speedTolerance = speed * this._speedToleranceFactor
      if (duration > 1000) {
        speedTolerance = 1000
      }
      if (speedTolerance > this._maxSpeedTolerance) {
        speedTolerance = this._maxSpeedTolerance
      }
      if (speedTolerance < this._minSpeedTolerance) {
        speedTolerance = this._minSpeedTolerance
      }
      this._lastScrollTop = scrollTop
      this._lastTimestamp = timestamp

      let topTolerance = 0
      let bottomTolerance = 0
      if (lastScrollTop < scrollTop) {
        topTolerance = this._minSpeedTolerance
        bottomTolerance = speedTolerance
      } else {
        topTolerance = speedTolerance
        bottomTolerance = this._minSpeedTolerance
      }

      if (
        this._topSpaceHeight < scrollTop - topTolerance &&
        this._topSpaceHeight + this._el.offsetHeight >
          scrollTop + offsetHeight + bottomTolerance
      ) {
        return
      }

      this.renderViewport({
        topTolerance: topTolerance * 2,
        bottomTolerance: bottomTolerance * 2,
      })
    })
  }
  _renderViewport({ topTolerance = 500, bottomTolerance = 500 } = {}) {
    const container = this._container
    const el = this._el
    if (isHidden(container)) return
    const { scrollTop, clientWidth, offsetHeight } = container
    const top = scrollTop - topTolerance
    const bottom = scrollTop + offsetHeight + bottomTolerance

    const displayLogs = this._displayLogs

    let topSpaceHeight = 0
    let bottomSpaceHeight = 0
    let currentHeight = 0

    const len = displayLogs.length

    const fakeEl = this._fakeEl
    const fakeFrag = document.createDocumentFragment()
    const logs = []
    for (let i = 0; i < len; i++) {
      const log = displayLogs[i]
      const { width, height } = log
      if (height === 0 || width !== clientWidth) {
        fakeFrag.appendChild(log.el)
        logs.push(log)
      }
    }
    if (logs.length > 0) {
      fakeEl.appendChild(fakeFrag)
      for (let i = 0, len = logs.length; i < len; i++) {
        logs[i].updateSize()
      }
      fakeEl.innerHTML = ''
    }

    const frag = document.createDocumentFragment()
    for (let i = 0; i < len; i++) {
      const log = displayLogs[i]
      const { el, height } = log

      if (currentHeight > bottom) {
        bottomSpaceHeight += height
      } else if (currentHeight + height > top) {
        frag.appendChild(el)
      } else if (currentHeight < top) {
        topSpaceHeight += height
      }

      currentHeight += height
    }

    this._updateSpace(currentHeight)
    this._updateTopSpace(topSpaceHeight)
    this._updateBottomSpace(bottomSpaceHeight)

    while (el.firstChild) {
      el.removeChild(el.lastChild)
    }
    el.appendChild(frag)

    const { scrollHeight } = container
    if (this._isAtBottom && scrollTop <= scrollHeight - offsetHeight) {
      container.scrollTop = 10000000
    }
  }
}

const getCurTime = () => dateFormat('HH:MM:ss ')

function getFrom() {
  const e = new Error()
  let ret = ''
  const lines = e.stack ? e.stack.split('\n') : ''

  for (let i = 0, len = lines.length; i < len; i++) {
    ret = lines[i]
    if (ret.indexOf('winConsole') > -1 && i < len - 1) {
      ret = lines[i + 1]
      break
    }
  }

  return ret
}
