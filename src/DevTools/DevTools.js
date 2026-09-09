import logger from '../lib/logger'
import Tool from './Tool'
import Settings from '../Settings/Settings'
import Emitter from 'licia/Emitter'
import defaults from 'licia/defaults'
import keys from 'licia/keys'
import last from 'licia/last'
import each from 'licia/each'
import isNum from 'licia/isNum'
import nextTick from 'licia/nextTick'
import $ from 'licia/$'
import toNum from 'licia/toNum'
import extend from 'licia/extend'
import isStr from 'licia/isStr'
import theme from 'licia/theme'
import upperFirst from 'licia/upperFirst'
import startWith from 'licia/startWith'
import ready from 'licia/ready'
import pointerEvent from 'licia/pointerEvent'
import evalCss from '../lib/evalCss'
import emitter from '../lib/emitter'
import { isDarkTheme } from '../lib/themes'
import LunaNotification from 'luna-notification'
import LunaModal from 'luna-modal'
import LunaTab from 'luna-tab'
import {
  classPrefix as c,
  eventClient,
  hasSafeArea,
  safeStorage,
} from '../lib/util'

export default class DevTools extends Emitter {
  constructor($container, { defaults = {}, inline = false } = {}) {
    super()

    this._defCfg = extend(
      {
        transparency: 1,
        displaySize: 80,
        theme: 'System preference',
      },
      defaults,
    )

    this._style = evalCss(require('./DevTools.scss'))

    this.$container = $container
    this._isShow = false
    this._opacity = 1
    this._tools = {}
    this._isResizing = false
    this._resizeTimer = null
    this._showTimer = null
    this._hideTimer = null
    this._resizeStartY = 0
    this._resizeStartSize = 0
    this._inline = inline

    this._initTpl()
    this._initTab()
    this._initNotification()
    this._initModal()

    ready(() => this._checkSafeArea())
    this._bindEvent()
  }
  show() {
    clearTimeout(this._showTimer)
    clearTimeout(this._hideTimer)
    this._isShow = true

    this._$el.show()
    if (!this._inline) this._$backdrop.show()
    this._tab.updateSlider()

    // Need a delay after show to enable transition effect.
    this._showTimer = setTimeout(() => {
      this._$el.css('opacity', this._opacity)
      if (!this._inline) this._$backdrop.css('opacity', 1)
    }, 50)

    this.emit('show')

    return this
  }
  hide() {
    if (this._inline) {
      return this
    }

    clearTimeout(this._showTimer)
    clearTimeout(this._hideTimer)
    this._isShow = false
    this.emit('hide')

    this._$el.css({ opacity: 0 })
    this._$backdrop.css({ opacity: 0 })
    this._hideTimer = setTimeout(() => {
      this._$el.hide()
      this._$backdrop.hide()
    }, 300)

    return this
  }
  toggle() {
    return this._isShow ? this.hide() : this.show()
  }
  add(tool) {
    const tab = this._tab

    if (!(tool instanceof Tool)) {
      const { init, show, hide, destroy } = new Tool()
      defaults(tool, { init, show, hide, destroy })
    }

    const name = tool.name
    if (!name) {
      return logger.error('You must specify a name for a tool')
    }

    if (this._tools[name]) {
      return logger.warn(`Tool ${name} already exists`)
    }

    const id = name.replace(/\s+/g, '-')
    this._$tools.prepend(`<div id="${c(id)}" class="${c(id + ' tool')}"></div>`)
    tool.init(this._$tools.find(`.${c(id)}.${c('tool')}`), this)
    tool.active = false
    this._tools[name] = tool

    if (name === 'settings') {
      tab.append({
        id: name,
        title: name,
      })
    } else {
      tab.insert(tab.length - 1, {
        id: name,
        title: name,
      })
    }

    return this
  }
  remove(name) {
    const tools = this._tools

    if (!tools[name]) return logger.warn(`Tool ${name} doesn't exist`)

    this._tab.remove(name)

    const tool = tools[name]
    delete tools[name]
    if (tool.active) {
      const toolKeys = keys(tools)
      if (toolKeys.length > 0) this.showTool(tools[last(toolKeys)].name)
    }
    tool.destroy()

    return this
  }
  removeAll() {
    each(this._tools, (tool) => this.remove(tool.name))

    return this
  }
  get(name) {
    const tool = this._tools[name]

    if (tool) return tool
  }
  showTool(name) {
    if (this._curTool === name) {
      return this
    }
    this._curTool = name

    const tools = this._tools

    const tool = tools[name]
    if (!tool) return

    let lastTool = {}

    each(tools, (tool) => {
      if (tool.active) {
        lastTool = tool
        tool.active = false
        tool.hide()
      }
    })

    tool.active = true
    tool.show()

    this._tab.select(name)

    this.emit('showTool', name, lastTool)

    return this
  }
  initCfg(settings) {
    const cfg = (this.config = Settings.createCfg('dev-tools', this._defCfg))

    this._setTransparency(cfg.get('transparency'))
    this._setDisplaySize(cfg.get('displaySize'))
    this._setTheme(cfg.get('theme'))

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'transparency':
          return this._setTransparency(val)
        case 'displaySize':
          return this._setDisplaySize(val)
        case 'theme':
          return this._setTheme(val)
      }
    })

    settings
      .separator()
      .select(cfg, 'theme', 'Theme', [
        'System preference',
        ...keys(evalCss.getThemes()),
      ])

    if (!this._inline) {
      settings
        .range(cfg, 'transparency', 'Transparency', {
          min: 0.2,
          max: 1,
          step: 0.01,
        })
        .range(cfg, 'displaySize', 'Display Size', {
          min: 40,
          max: 100,
          step: 1,
        })
    }

    settings
      .button('Restore defaults and reload', function () {
        const store = safeStorage('local')

        const data = JSON.parse(JSON.stringify(store))
        each(data, (val, key) => {
          if (!isStr(val)) {
            return
          }

          if (startWith(key, 'eruda')) {
            store.removeItem(key)
          }
        })

        window.location.reload()
      })
      .separator()
  }
  notify(content, options) {
    this._notification.notify(content, options)
  }
  destroy() {
    clearTimeout(this._showTimer)
    clearTimeout(this._hideTimer)
    evalCss.remove(this._style)
    this.removeAll()
    this._tab.destroy()
    this._$el.remove()
    this._$backdrop.remove()
    window.removeEventListener('resize', this._checkSafeArea)
    emitter.off(emitter.SCALE, this._updateTabHeight)
  }
  _checkSafeArea = () => {
    const { $container } = this

    if (hasSafeArea()) {
      $container.addClass(c('safe-area'))
    } else {
      $container.rmClass(c('safe-area'))
    }
  }
  _setTheme(t) {
    const { $container } = this

    if (t === 'System preference') {
      t = upperFirst(theme.get())
    }

    if (isDarkTheme(t)) {
      $container.addClass(c('dark'))
    } else {
      $container.rmClass(c('dark'))
    }
    evalCss.setTheme(t)
  }
  _setTransparency(opacity) {
    if (!isNum(opacity)) return

    this._opacity = opacity
    if (this._isShow) this._$el.css({ opacity })
  }
  _setDisplaySize(height) {
    if (this._inline) {
      height = 100
    }

    if (!isNum(height)) return

    this._$el.css({ height: height + '%' })
  }
  _initTpl() {
    const $container = this.$container

    $container.append(
      c(`
      <div class="backdrop" role="button" aria-label="Close Eruda"></div>
      <div class="dev-tools">
        <div class="resizer"></div>
        <div class="tab"></div>
        <div class="tools"></div>
        <div class="notification"></div>
        <div class="modal"></div>
      </div>
      `),
    )

    this._$backdrop = $container.find(c('.backdrop'))
    this._$el = $container.find(c('.dev-tools'))
    this._$tools = this._$el.find(c('.tools'))
  }
  _initTab() {
    this._tab = new LunaTab(this._$el.find(c('.tab')).get(0), {
      height: 40,
    })
    this._tab.on('select', (id) => this.showTool(id))
  }
  _updateTabHeight = (scale) => {
    this._tab.setOption('height', 40 * scale)
    nextTick(() => {
      this._tab.updateSlider()
    })
  }
  _initNotification() {
    this._notification = new LunaNotification(
      this._$el.find(c('.notification')).get(0),
      {
        position: {
          x: 'center',
          y: 'top',
        },
      },
    )
  }
  _initModal() {
    LunaModal.setContainer(this._$el.find(c('.modal')).get(0))
  }
  _bindEvent() {
    const $resizer = this._$el.find(c('.resizer'))
    const $navBar = this._$el.find(c('.nav-bar'))
    const $document = $(document)

    if (this._inline) {
      $resizer.hide()
    }

    this._$backdrop.on('click', () => this.hide())

    const startListener = (e) => {
      e.preventDefault()
      e.stopPropagation()

      e = e.origEvent
      this._isResizing = true
      this._resizeStartSize = this.config.get('displaySize')
      this._resizeStartY = eventClient('y', e)

      $resizer.css('height', '100%')

      $document.on(pointerEvent('move'), moveListener)
      $document.on(pointerEvent('up'), endListener)
    }
    const moveListener = (e) => {
      if (!this._isResizing) {
        return
      }
      e.preventDefault()
      e.stopPropagation()

      e = e.origEvent
      const deltaY =
        ((this._resizeStartY - eventClient('y', e)) / window.innerHeight) * 100
      let displaySize = this._resizeStartSize + deltaY
      if (displaySize < 40) {
        displaySize = 40
      } else if (displaySize > 100) {
        displaySize = 100
      }
      this.config.set('displaySize', toNum(displaySize.toFixed(2)))
    }
    const endListener = () => {
      clearTimeout(this._resizeTimer)
      this._isResizing = false

      $resizer.css('height', 10)

      $document.off(pointerEvent('move'), moveListener)
      $document.off(pointerEvent('up'), endListener)
    }
    $resizer.css('height', 10)
    $resizer.on(pointerEvent('down'), startListener)

    $navBar.on('contextmenu', (e) => e.preventDefault())
    this.$container.on('click', (e) => e.stopPropagation())
    window.addEventListener('resize', this._checkSafeArea)

    emitter.on(emitter.SCALE, this._updateTabHeight)

    theme.on('change', () => {
      const t = this.config.get('theme')
      if (t === 'System preference') {
        this._setTheme(t)
      }
    })
  }
}
