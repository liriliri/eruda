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
import LunaTextViewer from 'luna-text-viewer'
import evalCss from '../lib/evalCss'
import { classPrefix as c } from '../lib/util'

export default class Sources extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Sources.scss'))

    this.name = 'sources'
    this._showLineNum = true
  }
  init($el, container) {
    super.init($el)

    this._container = container
    this._bindEvent()
    this._initCfg()
  }
  destroy() {
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
      false
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
    this._renderHtml(`<ul class="${c('json')}"></ul>`, false)

    let val = this._data.val

    try {
      if (isStr(val)) {
        val = JSON.parse(val)
      }
    } catch {
      // No op
    }

    const objViewer = new LunaObjectViewer(
      this._$el.find('.eruda-json').get(0),
      {
        unenumerable: true,
        accessGetter: true,
        prototype: false,
      }
    )
    objViewer.set(val)
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
