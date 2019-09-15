import Logger from './Logger'
import Tool from '../DevTools/Tool'
import { noop, evalCss, $, Emitter } from '../lib/util'
import emitter from '../lib/emitter'
import Settings from '../Settings/Settings'
import stringify from './stringify'

export default class Console extends Tool {
  constructor() {
    super()

    Emitter.mixin(this)

    this.name = 'console'
    this._scale = 1

    this._registerListener()
  }
  init($el, container) {
    super.init($el)
    this._container = container

    this._appendTpl()

    this._initLogger()
    this._exposeLogger()
    this._rejectionHandler = e => this._logger.error(e.reason)

    this._initCfg()
    this._bindEvent()
  }
  show() {
    super.show()

    this._logger.render()
  }
  overrideConsole() {
    const origConsole = (this._origConsole = {})
    const winConsole = window.console

    CONSOLE_METHOD.forEach(name => {
      let origin = (origConsole[name] = noop)
      if (winConsole[name]) {
        origin = origConsole[name] = winConsole[name].bind(winConsole)
      }

      winConsole[name] = (...args) => {
        if (args.length > 0 || name === 'groupEnd') {
          this[name](...args)
        }
        origin(...args)
      }
    })

    return this
  }
  restoreConsole() {
    if (!this._origConsole) return this

    CONSOLE_METHOD.forEach(
      name => (window.console[name] = this._origConsole[name])
    )
    delete this._origConsole

    return this
  }
  catchGlobalErr() {
    this._origOnerror = window.onerror

    window.onerror = (errMsg, url, lineNum, column, errObj) => {
      this._logger.error(errObj ? errObj : errMsg)
    }
    window.addEventListener('unhandledrejection', this._rejectionHandler)

    return this
  }
  ignoreGlobalErr() {
    if (this._origOnerror) {
      window.onerror = this._origOnerror
      delete this._origOnerror
    }
    window.removeEventListener('unhandledrejection', this._rejectionHandler)

    return this
  }
  destroy() {
    this._logger.destroy()
    super.destroy()

    evalCss.remove(this._style)
    this.ignoreGlobalErr()
    this.restoreConsole()
    this._unregisterListener()
    this._rmCfg()
  }
  _registerListener() {
    this._scaleListener = scale => (this._scale = scale)

    emitter.on(emitter.SCALE, this._scaleListener)
  }
  _unregisterListener() {
    emitter.off(emitter.SCALE, this._scaleListener)
  }
  _appendTpl() {
    const $el = this._$el

    this._style = evalCss(require('./Console.scss'))
    $el.append(require('./Console.hbs')())

    const _$inputContainer = $el.find('.eruda-js-input'),
      _$input = _$inputContainer.find('textarea'),
      _$inputBtns = _$inputContainer.find('.eruda-buttons')

    Object.assign(this, {
      _$control: $el.find('.eruda-control'),
      _$logs: $el.find('.eruda-logs'),
      _$inputContainer,
      _$input,
      _$inputBtns
    })
  }
  _initLogger() {
    const $filter = this._$control.find('.eruda-filter')
    const logger = (this._logger = new Logger(this._$logs, this))

    logger.on('filter', filter =>
      $filter.each(function() {
        const $this = $(this),
          isMatch = $this.data('filter') === filter

        $this[isMatch ? 'addClass' : 'rmClass']('eruda-active')
      })
    )
  }
  _exposeLogger() {
    const logger = this._logger,
      methods = ['filter', 'html'].concat(CONSOLE_METHOD)

    methods.forEach(
      name =>
        (this[name] = (...args) => {
          logger[name](...args)
          this.emit(name, ...args)

          return this
        })
    )
  }
  _bindEvent() {
    const container = this._container
    const $input = this._$input,
      $inputBtns = this._$inputBtns,
      $control = this._$control,
      logger = this._logger,
      config = this.config

    $control
      .on('click', '.eruda-clear-console', () => logger.clear())
      .on('click', '.eruda-filter', function() {
        logger.filter($(this).data('filter'))
      })
      .on('click', '.eruda-help', () => logger.help())

    $inputBtns
      .on('click', '.eruda-cancel', () => this._hideInput())
      .on('click', '.eruda-execute', () => {
        const jsInput = $input.val().trim()
        if (jsInput === '') return

        logger.input(jsInput)
        $input
          .val('')
          .get(0)
          .blur()
        this._hideInput()
      })

    $input.on('focusin', () => this._showInput())

    logger
      .on('viewJson', data => {
        const sources = container.get('sources')
        if (!sources) return

        sources.set('json', data)
        container.showTool('sources')
      })
      .on('insert', log => {
        const autoShow = log.type === 'error' && config.get('displayIfErr')

        if (autoShow) container.showTool('console').show()
      })
  }
  _hideInput() {
    this._$inputContainer.css({
      paddingTop: 0,
      height: 40 * this._scale
    })

    this._$inputBtns.hide()
  }
  _showInput() {
    this._$inputContainer.css({
      paddingTop: 40 * this._scale,
      height: '100%'
    })

    this._$inputBtns.show()
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')
    if (!settings) return

    settings
      .remove(cfg, 'catchGlobalErr')
      .remove(cfg, 'overrideConsole')
      .remove(cfg, 'displayExtraInfo')
      .remove(cfg, 'displayUnenumerable')
      .remove(cfg, 'displayGetterVal')
      .remove(cfg, 'lazyEvaluation')
      .remove(cfg, 'viewLogInSources')
      .remove(cfg, 'displayIfErr')
      .remove(cfg, 'useWorker')
      .remove(cfg, 'maxLogNum')
      .remove('Console')
  }
  _initCfg() {
    const container = this._container
    const sources = container.get('sources')
    const logger = this._logger

    const cfg = (this.config = Settings.createCfg('console', {
      catchGlobalErr: true,
      overrideConsole: true,
      displayExtraInfo: false,
      displayUnenumerable: true,
      displayGetterVal: false,
      lazyEvaluation: true,
      viewLogInSources: false,
      displayIfErr: false,
      useWorker: false,
      maxLogNum: 'infinite'
    }))

    const isWorkerSupported = !!window.Worker

    let maxLogNum = cfg.get('maxLogNum')
    maxLogNum = maxLogNum === 'infinite' ? maxLogNum : +maxLogNum

    if (cfg.get('catchGlobalErr')) this.catchGlobalErr()
    if (cfg.get('overrideConsole')) this.overrideConsole()
    if (cfg.get('useWorker') && isWorkerSupported) stringify.useWorker = true
    logger.displayHeader(cfg.get('displayExtraInfo'))
    logger.displayUnenumerable(cfg.get('displayUnenumerable'))
    logger.displayGetterVal(cfg.get('displayGetterVal'))
    logger.lazyEvaluation(cfg.get('lazyEvaluation'))
    if (sources) logger.viewLogInSources(cfg.get('viewLogInSources'))
    logger.maxNum(maxLogNum)

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'catchGlobalErr':
          return val ? this.catchGlobalErr() : this.ignoreGlobalErr()
        case 'overrideConsole':
          return val ? this.overrideConsole() : this.restoreConsole()
        case 'maxLogNum':
          return logger.maxNum(val === 'infinite' ? val : +val)
        case 'displayExtraInfo':
          return logger.displayHeader(val)
        case 'displayUnenumerable':
          return logger.displayUnenumerable(val)
        case 'displayGetterVal':
          return logger.displayGetterVal(val)
        case 'lazyEvaluation':
          return logger.lazyEvaluation(val)
        case 'viewLogInSources':
          return logger.viewLogInSources(val)
        case 'useWorker':
          stringify.useWorker = val
          return
      }
    })

    const settings = container.get('settings')

    settings
      .text('Console')
      .switch(cfg, 'catchGlobalErr', 'Catch Global Errors')
      .switch(cfg, 'overrideConsole', 'Override Console')
      .switch(cfg, 'displayIfErr', 'Auto Display If Error Occurs')
      .switch(cfg, 'displayExtraInfo', 'Display Extra Information')
      .switch(cfg, 'displayUnenumerable', 'Display Unenumerable Properties')
      .switch(cfg, 'displayGetterVal', 'Access Getter Value')
      .switch(cfg, 'lazyEvaluation', 'Lazy Evaluation')

    if (isWorkerSupported) settings.switch(cfg, 'useWorker', 'Use Web Worker')
    if (sources) {
      settings.switch(cfg, 'viewLogInSources', 'View Log In Sources Panel')
    }

    settings
      .select(cfg, 'maxLogNum', 'Max Log Number', [
        'infinite',
        '250',
        '125',
        '100',
        '50',
        '10'
      ])
      .separator()
  }
}

const CONSOLE_METHOD = [
  'log',
  'error',
  'info',
  'warn',
  'dir',
  'time',
  'timeEnd',
  'clear',
  'table',
  'assert',
  'count',
  'debug',
  'group',
  'groupEnd',
  'groupCollapsed'
]
