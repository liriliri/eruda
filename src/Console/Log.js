import stringify from './stringify'
import origGetAbstract from '../lib/getAbstract'
import beautify from 'js-beautify'
import JsonViewer from '../lib/JsonViewer'
import {
  isObj,
  isStr,
  isErr,
  wrap,
  defaults,
  dateFormat,
  getObjType,
  isEl,
  toStr,
  toNum,
  toInt,
  escape,
  isNull,
  isUndef,
  isFn,
  toArr,
  isArr,
  unique,
  contain,
  isEmpty,
  clone,
  noop,
  highlight,
  $
} from '../lib/util'

export default class Log {
  constructor({
    type = 'log',
    args = [],
    id,
    displayHeader = false,
    ignoreFilter = false
  }) {
    this.type = type
    this.args = args
    this.count = 1
    this.id = id
    this.displayHeader = displayHeader
    this.ignoreFilter = ignoreFilter

    if (displayHeader) {
      this.time = getCurTime()
      this.from = getFrom()
    }

    this._formatMsg()
  }
  addCount() {
    this.count++
    const count = this.count
    let msg = this.formattedMsg
    if (count === 2)
      msg = msg.replace('eruda-count eruda-hidden', 'eruda-count')
    msg = msg.replace(/data-mark="count">\d*/, 'data-mark="count">' + count)

    this.formattedMsg = msg

    return this
  }
  updateTime(time) {
    let msg = this.formattedMsg

    if (this.time) {
      msg = msg.replace(/data-mark="time">(.*?)</, `data-mark="time">${time}<`)
      this.time = time
      this.formattedMsg = msg
    }

    return this
  }
  _needSrc() {
    const { type, args } = this

    if (type === 'html') return false

    for (let i = 0, len = args.length; i < len; i++) {
      if (isObj(args[i])) return true
    }

    return false
  }
  extractObj(cb = noop) {
    const { args, type } = this

    const setSrc = result => {
      this.src = result
      cb()
    }
    if (type === 'table') {
      extractObj(args[0], {}, setSrc)
    } else {
      extractObj(
        args.length === 1 && isObj(args[0]) ? args[0] : args,
        {},
        setSrc
      )
    }
  }
  _formatMsg() {
    let { args } = this
    const { type, id, displayHeader, time, from } = this

    // Don't change original args for lazy evaluation.
    args = clone(args)

    if (this._needSrc() && !Log.lazyEvaluation) {
      this.extractObj()
    }

    let msg = ''
    let icon
    let err

    switch (type) {
      case 'groupCollapsed':
        msg = formatMsg(args)
        icon = 'groupCollapsed'
        break
      case 'group':
        msg = formatMsg(args)
        icon = 'group'
        break
      case 'log':
        msg = formatMsg(args)
        break
      case 'debug':
        msg = formatMsg(args)
        break
      case 'dir':
        msg = formatDir(args)
        break
      case 'info':
        icon = 'info'
        msg = formatMsg(args)
        break
      case 'warn':
        icon = 'warn'
        msg = formatMsg(args)
        break
      case 'error':
        if (isStr(args[0]) && args.length !== 1) args = substituteStr(args)
        err = args[0]
        icon = 'error'
        err = isErr(err) ? err : new Error(formatMsg(args))
        this.src = err
        msg = formatErr(err)
        break
      case 'table':
        msg = formatTable(args)
        break
      case 'html':
        msg = args[0]
        break
      case 'input':
        msg = formatJs(args[0])
        icon = 'arrow-right'
        break
      case 'output':
        msg = formatMsg(args)
        icon = 'arrow-left'
        break
    }

    if (type !== 'error') msg = recognizeUrl(msg)
    this.value = msg
    msg = render({ msg, type, icon, id, displayHeader, time, from })

    if (!this._needSrc() || !Log.lazyEvaluation) {
      delete this.args
    }
    this.formattedMsg = msg
  }
  static click(type, log, $el, logger) {
    switch (type) {
      case 'log':
      case 'warn':
      case 'info':
      case 'debug':
      case 'output':
      case 'table':
      case 'dir':
        if (log.src) {
          if (Log.showSrcInSources) {
            return logger.emit('viewJson', log.src)
          }
          const $json = $el.find('.eruda-json')
          if ($json.hasClass('eruda-hidden')) {
            if ($json.data('init') !== 'true') {
              new JsonViewer(log.src, $json)
              $json.data('init', 'true')
            }
            $json.rmClass('eruda-hidden')
          } else {
            $json.addClass('eruda-hidden')
          }
        } else if (log.args) {
          log.extractObj(function() {
            Log.click(type, log, $el, logger)
            delete log.args
          })
        }
        break
      case 'error':
        $el.find('.eruda-stack').toggleClass('eruda-hidden')
        break
      case 'groupCollapsed':
      case 'group': {
        const groupIcon = $el.find('.eruda-icon')
        if (groupIcon.hasClass('eruda-icon-group')) {
          groupIcon.rmClass('eruda-icon-group')
          groupIcon.addClass('eruda-icon-groupCollapsed')
          $($el.parent()[0].nextSibling).addClass('eruda-hidden')
        } else {
          groupIcon.addClass('eruda-icon-group')
          groupIcon.rmClass('eruda-icon-groupCollapsed')
          $($el.parent()[0].nextSibling).rmClass('eruda-hidden')
        }
        break
      }

    }

    return 'handled'
  }
}

// Looks like es6 doesn't support static properties yet.
Log.showGetterVal = false
Log.showUnenumerable = true
Log.showSrcInSources = false
Log.lazyEvaluation = true

const getAbstract = wrap(origGetAbstract, function(fn, obj) {
  return fn(obj, {
    getterVal: Log.showGetterVal,
    unenumerable: false
  })
})

function formatTable(args) {
  const table = args[0]
  let ret = ''
  let filter = args[1]
  let columns = []

  if (isStr(filter)) filter = toArr(filter)
  if (!isArr(filter)) filter = null

  if (!isArr(table)) return formatMsg(args)

  table.forEach(val => {
    if (!isObj(val)) return
    columns = columns.concat(Object.getOwnPropertyNames(val))
  })
  columns = unique(columns)
  columns.sort()
  if (filter) columns = columns.filter(val => contain(filter, val))
  if (isEmpty(columns)) return formatMsg(args)

  ret += '<table><thead><tr><th>(index)</th>'
  columns.forEach(val => (ret += `<th>${val}</th>`))
  ret += '</tr></thead><tbody>'

  table.forEach((obj, idx) => {
    if (!isObj(obj)) return
    ret += `<tr><td>${idx}</td>`
    columns.forEach(column => {
      let val = obj[column]
      if (isUndef(val)) {
        val = ''
      } else if (isObj(val)) {
        val = getObjType(val)
      }

      ret += `<td>${val}</td>`
    })
    ret += '</tr>'
  })

  ret += '</tbody></table>'
  ret += '<div class="eruda-json eruda-hidden"></div>'

  return ret
}

const regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Z.a-z0-9/]*\.js/g
const regErudaJs = /eruda(\.min)?\.js/

function formatErr(err) {
  let lines = err.stack ? err.stack.split('\n') : []
  const msg = `${err.message || lines[0]}<br/>`

  lines = lines.filter(val => !regErudaJs.test(val)).map(val => escape(val))

  const stack = `<div class="eruda-stack eruda-hidden">${lines
    .slice(1)
    .join('<br/>')}</div>`

  return (
    msg +
    stack.replace(
      regJsUrl,
      match => `<a href="${match}" target="_blank">${match}</a>`
    )
  )
}

function formatJs(code) {
  return highlight(beautify(code), 'js')
}

function formatMsg(args, { htmlForEl = true } = {}) {
  const needStrSubstitution = isStr(args[0]) && args.length !== 1
  if (needStrSubstitution) args = substituteStr(args)

  for (let i = 0, len = args.length; i < len; i++) {
    let val = args[i]

    if (isEl(val) && htmlForEl) {
      args[i] = formatEl(val)
    } else if (isFn(val)) {
      args[i] = formatFn(val)
    } else if (isObj(val)) {
      args[i] = formatObj(val)
    } else if (isUndef(val)) {
      args[i] = 'undefined'
    } else if (isNull(val)) {
      args[i] = 'null'
    } else {
      val = toStr(val)
      if (i !== 0 || !needStrSubstitution) val = escape(val)
      args[i] = val
    }
  }

  return args.join(' ') + '<div class="eruda-json eruda-hidden"></div>'
}

const formatDir = args => formatMsg(args, { htmlForEl: false })

function substituteStr(args) {
  const str = escape(args[0])
  let isInCss = false
  let newStr = ''

  args.shift()

  for (let i = 0, len = str.length; i < len; i++) {
    const c = str[i]

    if (c === '%' && args.length !== 0) {
      i++
      const arg = args.shift()
      switch (str[i]) {
        case 'i':
        case 'd':
          newStr += toInt(arg)
          break
        case 'f':
          newStr += toNum(arg)
          break
        case 's':
          newStr += toStr(arg)
          break
        case 'O':
          if (isObj(arg)) {
            newStr += getAbstract(arg)
          }
          break
        case 'o':
          if (isEl(arg)) {
            newStr += formatEl(arg)
          } else if (isObj(arg)) {
            newStr += getAbstract(arg)
          }
          break
        case 'c':
          if (isInCss) newStr += '</span>'
          isInCss = true
          newStr += `<span style="${arg}">`
          break
        default:
          i--
          args.unshift(arg)
          newStr += c
      }
    } else {
      newStr += c
    }
  }
  if (isInCss) newStr += '</span>'

  args.unshift(newStr)

  return args
}

function formatObj(val) {
  let type = getObjType(val)
  if (type === 'Array' && val.length > 1) type = `(${val.length})`

  return `${type} ${getAbstract(val)}`
}

function formatFn(val) {
  return `<pre style="display:inline">${highlight(
    beautify.js(val.toString()),
    'js'
  )}</pre>`
}

function formatEl(val) {
  return `<pre style="display:inline">${highlight(
    beautify.html(val.outerHTML, { unformatted: [] }),
    'html'
  )}</pre>`
}

const regUrl = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[-A-Z0-9+\u0026\u2019@#/%?=()~_|!:,.;]*[-A-Z0-9+\u0026@#/%=~()_|])/gi

const recognizeUrl = str =>
  str.replace(regUrl, '<a href="$2" target="_blank">$2</a>')

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

const getCurTime = () => dateFormat('HH:MM:ss')

const tpl = require('./Log.hbs')
const render = data => tpl(data)

function extractObj(obj, options = {}, cb) {
  defaults(options, {
    accessGetter: Log.showGetterVal,
    unenumerable: Log.showUnenumerable,
    symbol: Log.showUnenumerable,
    timeout: 1000
  })

  stringify(obj, options, result => cb(JSON.parse(result)))
}
