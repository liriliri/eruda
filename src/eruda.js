import EntryBtn from './EntryBtn/EntryBtn'
import DevTools from './DevTools/DevTools'
import Tool from './DevTools/Tool'
import Console from './Console/Console'
import Network from './Network/Network'
import Elements from './Elements/Elements'
import Snippets from './Snippets/Snippets'
import Resources from './Resources/Resources'
import Info from './Info/Info'
import Sources from './Sources/Sources'
import Settings from './Settings/Settings'
import emitter from './lib/emitter'
import logger from './lib/logger'
import * as util from './lib/util'
import { isDarkTheme } from './lib/themes'
import themes from './lib/themes'
import isFn from 'licia/isFn'
import isNum from 'licia/isNum'
import isObj from 'licia/isObj'
import each from 'licia/each'
import isMobile from 'licia/isMobile'
import viewportScale from 'licia/viewportScale'
import detectBrowser from 'licia/detectBrowser'
import $ from 'licia/$'
import toArr from 'licia/toArr'
import upperFirst from 'licia/upperFirst'
import nextTick from 'licia/nextTick'
import isEqual from 'licia/isEqual'
import extend from 'licia/extend'
import evalCss from './lib/evalCss'
import chobitsu from './lib/chobitsu'

export default {
  init({
    container,
    tool,
    autoScale = true,
    useShadowDom = true,
    inline = false,
    hideEntry = false,
    defaults = {},
  } = {}) {
    if (this._isInit) {
      return
    }

    this._isInit = true
    this._scale = 1

    this._initContainer(container, useShadowDom)
    this._initStyle()
    this._initDevTools(defaults, inline)
    this._initEntryBtn()
    this._initSettings()
    this._initTools(tool)
    this._registerListener()

    if (autoScale) {
      this._autoScale()
    }

    if (hideEntry) {
      this._entryBtn.hide()
    }

    if (inline) {
      this._entryBtn.hide()
      this._$el.addClass('eruda-inline')
      this.show()
    }
  },
  _isInit: false,
  version: VERSION,
  util: {
    isErudaEl: util.isErudaEl,
    evalCss,
    isDarkTheme(theme) {
      if (!theme) {
        theme = this.getTheme()
      }
      return isDarkTheme(theme)
    },
    getTheme: () => {
      const curTheme = evalCss.getCurTheme()

      let result = 'Light'
      each(themes, (theme, name) => {
        if (isEqual(theme, curTheme)) {
          result = name
        }
      })

      return result
    },
  },
  chobitsu,
  Tool,
  Console,
  Elements,
  Network,
  Sources,
  Resources,
  Info,
  Snippets,
  Settings,
  get(name) {
    if (!this._checkInit()) return

    if (name === 'entryBtn') return this._entryBtn

    const devTools = this._devTools

    return name ? devTools.get(name) : devTools
  },
  add(tool) {
    if (!this._checkInit()) return

    if (isFn(tool)) tool = tool(this)

    this._devTools.add(tool)

    return this
  },
  remove(name) {
    this._devTools.remove(name)

    return this
  },
  show(name) {
    if (!this._checkInit()) return

    const devTools = this._devTools

    name ? devTools.showTool(name) : devTools.show()

    return this
  },
  hide() {
    if (!this._checkInit()) return

    this._devTools.hide()

    return this
  },
  destroy() {
    this._devTools.destroy()
    delete this._devTools
    this._entryBtn.destroy()
    delete this._entryBtn
    this._unregisterListener()
    $(this._container).remove()
    evalCss.clear()
    this._isInit = false
    this._container = null
    this._shadowRoot = null
  },
  scale(s) {
    if (isNum(s)) {
      this._scale = s
      emitter.emit(emitter.SCALE, s)
      return this
    }

    return this._scale
  },
  position(p) {
    const entryBtn = this._entryBtn

    if (isObj(p)) {
      entryBtn.setPos(p)
      return this
    }

    return entryBtn.getPos()
  },
  _autoScale() {
    if (!isMobile()) return

    this.scale(1 / viewportScale())
  },
  _registerListener() {
    this._addListener = (...args) => this.add(...args)
    this._showListener = (...args) => this.show(...args)

    emitter.on(emitter.ADD, this._addListener)
    emitter.on(emitter.SHOW, this._showListener)
    emitter.on(emitter.SCALE, evalCss.setScale)
  },
  _unregisterListener() {
    emitter.off(emitter.ADD, this._addListener)
    emitter.off(emitter.SHOW, this._showListener)
    emitter.off(emitter.SCALE, evalCss.setScale)
  },
  _checkInit() {
    if (!this._isInit) logger.error('Please call "eruda.init()" first')
    return this._isInit
  },
  _initContainer(container, useShadowDom) {
    if (!container) {
      container = document.createElement('div')
      document.documentElement.appendChild(container)
    }

    container.id = 'eruda'
    container.style.all = 'initial'
    this._container = container

    let shadowRoot
    let el
    if (useShadowDom) {
      if (container.attachShadow) {
        shadowRoot = container.attachShadow({ mode: 'open' })
      } else if (container.createShadowRoot) {
        shadowRoot = container.createShadowRoot()
      }
      if (shadowRoot) {
        // font-face doesn't work inside shadow dom.
        evalCss.container = document.head
        evalCss(
          require('./style/icon.css') +
          require('luna-console/luna-console.css') +
          require('luna-object-viewer/luna-object-viewer.css') +
          require('luna-dom-viewer/luna-dom-viewer.css') +
          require('luna-text-viewer/luna-text-viewer.css') +
          require('luna-notification/luna-notification.css')
        )

        el = document.createElement('div')
        shadowRoot.appendChild(el)
        this._shadowRoot = shadowRoot
      }
    }

    if (!this._shadowRoot) {
      el = document.createElement('div')
      container.appendChild(el)
    }

    extend(el, {
      className: 'eruda-container __chobitsu-hide__',
      contentEditable: false,
    })

    // http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
    if (detectBrowser().name === 'ios') el.setAttribute('ontouchstart', '')

    this._$el = $(el)
  },
  _initDevTools(defaults, inline) {
    this._devTools = new DevTools(this._$el, {
      defaults,
      inline,
    })
  },
  _initStyle() {
    const className = 'eruda-style-container'
    const $el = this._$el

    if (this._shadowRoot) {
      evalCss.container = this._shadowRoot
      evalCss(':host { all: initial }')
    } else {
      $el.append(`<div class="${className}"></div>`)
      evalCss.container = $el.find(`.${className}`).get(0)
    }

    evalCss(
      require('./style/reset.scss') +
      require('luna-object-viewer/luna-object-viewer.css') +
      require('luna-console/luna-console.css') +
      require('luna-notification/luna-notification.css') +
      require('luna-data-grid/luna-data-grid.css') +
      require('luna-dom-viewer/luna-dom-viewer.css') +
      require('luna-modal/luna-modal.css') +
      require('luna-tab/luna-tab.css') +
      require('luna-text-viewer/luna-text-viewer.css') +
      require('luna-setting/luna-setting.css') +
      require('luna-box-model/luna-box-model.css') +
      require('./style/style.scss') +
      require('./style/icon.css')
    )
  },
  _initEntryBtn() {
    this._entryBtn = new EntryBtn(this._$el)
    this._entryBtn.on('click', () => this._devTools.toggle())
  },
  _initSettings() {
    const devTools = this._devTools
    const settings = new Settings()

    devTools.add(settings)

    this._entryBtn.initCfg(settings)
    devTools.initCfg(settings)
  },
  _initTools(
    tool = [
      'console',
      'elements',
      'network',
      'resources',
      'sources',
      'info',
      'snippets',
    ]
  ) {
    tool = toArr(tool)

    const devTools = this._devTools

    tool.forEach((name) => {
      const Tool = this[upperFirst(name)]
      try {
        if (Tool) devTools.add(new Tool())
      } catch (e) {
        // Use nextTick to make sure it is possible to be caught by console panel.
        nextTick(() => {
          logger.error(
            `Something wrong when initializing tool ${name}:`,
            e.message
          )
        })
      }
    })

    devTools.showTool(tool[0] || 'settings')
  },
}
