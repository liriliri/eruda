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
import config from './lib/config'
import logger from './lib/logger'
import extraUtil from './lib/extraUtil'
import util from './lib/util'
import {
  isFn,
  evalCss,
  isNum,
  isObj,
  isMobile,
  viewportScale,
  detectBrowser,
  $,
  toArr,
  upperFirst,
  nextTick,
  last
} from './lib/util'

module.exports = {
  init({ container, tool, autoScale = true, useShadowDom = true } = {}) {
    this._isInit = true
    this._scale = 1

    this._initContainer(container, useShadowDom)
    this._initStyle()
    this._initDevTools()
    this._initEntryBtn()
    this._initSettings()
    this._initTools(tool)
    this._registerListener()

    if (autoScale) this._autoScale()
  },
  _isInit: false,
  version: VERSION,
  config,
  util,
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

    let devTools = this._devTools

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

    let devTools = this._devTools

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
    this._$el.remove()
    evalCss.clear()
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
  _initContainer(el, useShadowDom) {
    if (!el) {
      el = document.createElement('div')
      el.setAttribute('growing-ignore', true)
      document.documentElement.appendChild(el)
    }

    let shadowRoot
    if (useShadowDom) {
      if (el.attachShadow) {
        shadowRoot = el.attachShadow({ mode: 'open' })
      } else if (el.createShadowRoot) {
        shadowRoot = el.createShadowRoot()
      }
      if (shadowRoot) {
        // font-face doesn't work inside shadow dom.
        evalCss.container = document.head
        evalCss(require('./style/icon.css'))

        el = document.createElement('div')
        shadowRoot.appendChild(el)
        this._shadowRoot = shadowRoot
      }
    }

    Object.assign(el, {
      id: 'eruda',
      className: 'eruda-container',
      contentEditable: false
    })

    // http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
    if (detectBrowser().name === 'ios') el.setAttribute('ontouchstart', '')

    this._$el = $(el)
  },
  _initDevTools() {
    this._devTools = new DevTools(this._$el)
  },
  _initStyle() {
    let className = 'eruda-style-container'
    let $el = this._$el

    if (this._shadowRoot) {
      evalCss.container = this._shadowRoot
      evalCss(':host { all: initial }')
    } else {
      $el.append(`<div class="${className}"></div>`)
      evalCss.container = $el.find(`.${className}`).get(0)
    }

    evalCss(
      require('./style/style.scss') +
        require('./style/reset.scss') +
        require('./style/icon.css')
    )
  },
  _initEntryBtn() {
    this._entryBtn = new EntryBtn(this._$el)
    this._entryBtn.on('click', () => this._devTools.toggle())
  },
  _initSettings() {
    let devTools = this._devTools
    let settings = new Settings()

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
      'snippets'
    ]
  ) {
    tool = toArr(tool).reverse()

    let devTools = this._devTools

    tool.forEach(name => {
      let Tool = this[upperFirst(name)]
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

    devTools.showTool(last(tool) || 'settings')
  }
}

extraUtil(util)

//# sourceMappingURL=index.js.map
