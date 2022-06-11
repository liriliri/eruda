import Tool from '../DevTools/Tool'
import Settings from '../Settings/Settings'
import {
  $,
  unique,
  each,
  isStr,
  startWith,
  trim,
  orientation,
  sameOrigin,
  ajax,
  MutationObserver,
  toArr,
  concat,
  isNull,
  lowerCase,
  contain,
  filter,
  map,
  copy
} from '../lib/util'
import { safeStorage } from '../lib/fione'
import { isErudaEl } from '../lib/extraUtil'
import evalCss from '../lib/evalCss'
import chobitsu from 'chobitsu'

export default class Resources extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Resources.scss'))

    this.name = 'resources'
    this._localStoreData = []
    this._localStoreSearchKeyword = ''
    this._hideErudaSetting = false
    this._sessionStoreData = []
    this._sessionStoreSearchKeyword = ''
    this._cookieData = []
    this._cookieSearchKeyword = ''
    this._scriptData = []
    this._stylesheetData = []
    this._iframeData = []
    this._imageData = []
    this._observeElement = true
    this._tpl = require('./Resources.hbs')
  }
  init($el, container) {
    super.init($el)

    this._container = container

    this.refresh()
    this._bindEvent()
    this._initObserver()
    this._initCfg()
  }
  refresh() {
    return this.refreshLocalStorage()
      .refreshSessionStorage()
      .refreshCookie()
      .refreshScript()
      .refreshStylesheet()
      .refreshIframe()
      .refreshImage()
      ._render()
  }
  destroy() {
    super.destroy()

    this._disableObserver()
    evalCss.remove(this._style)
    this._rmCfg()
  }
  refreshScript() {
    let scriptData = []

    $('script').each(function () {
      const src = this.src

      if (src !== '') scriptData.push(src)
    })

    scriptData = unique(scriptData)

    this._scriptData = scriptData

    return this
  }
  refreshStylesheet() {
    let stylesheetData = []

    $('link').each(function () {
      if (this.rel !== 'stylesheet') return

      stylesheetData.push(this.href)
    })

    stylesheetData = unique(stylesheetData)

    this._stylesheetData = stylesheetData

    return this
  }
  refreshIframe() {
    let iframeData = []

    $('iframe').each(function () {
      const $this = $(this)
      const src = $this.attr('src')

      if (src) iframeData.push(src)
    })

    iframeData = unique(iframeData)

    this._iframeData = iframeData

    return this
  }
  refreshLocalStorage() {
    this._refreshStorage('local')

    return this
  }
  refreshSessionStorage() {
    this._refreshStorage('session')

    return this
  }
  _refreshStorage(type) {
    let store = safeStorage(type, false)

    if (!store) return

    const storeData = []

    // Mobile safari is not able to loop through localStorage directly.
    store = JSON.parse(JSON.stringify(store))

    each(store, (val, key) => {
      // According to issue 20, not all values are guaranteed to be string.
      if (!isStr(val)) return

      if (this._hideErudaSetting) {
        if (startWith(key, 'eruda') || key === 'active-eruda') return
      }

      storeData.push({
        key: key,
        val: sliceStr(val, 200),
      })
    })

    this['_' + type + 'StoreData'] = storeData
  }
  refreshCookie() {
    const { cookies } = chobitsu.domain('Network').getCookies()
    const cookieData = map(cookies, ({ name, value }) => ({
      key: name,
      val: value,
    }))

    this._cookieData = cookieData

    return this
  }
  refreshImage() {
    let imageData = []

    const performance = (this._performance =
      window.webkitPerformance || window.performance)
    if (performance && performance.getEntries) {
      const entries = this._performance.getEntries()
      entries.forEach((entry) => {
        if (entry.initiatorType === 'img' || isImg(entry.name)) {
          imageData.push(entry.name)
        }
      })
    } else {
      $('img').each(function () {
        const $this = $(this)
        const src = $this.attr('src')

        if ($this.data('exclude') === 'true') return

        imageData.push(src)
      })
    }

    imageData = unique(imageData)
    imageData.sort()
    this._imageData = imageData

    return this
  }
  show() {
    super.show()
    if (this._observeElement) this._enableObserver()

    return this.refresh()
  }
  hide() {
    this._disableObserver()

    return super.hide()
  }
  _bindEvent() {
    const self = this
    const $el = this._$el
    const container = this._container

    $el
      .on('click', '.eruda-refresh-local-storage', () => {
        container.notify('Refreshed')
        this.refreshLocalStorage()._render()
      })
      .on('click', '.eruda-refresh-session-storage', () => {
        container.notify('Refreshed')
        this.refreshSessionStorage()._render()
      })
      .on('click', '.eruda-refresh-cookie', () => {
        container.notify('Refreshed')
        this.refreshCookie()._render()
      })
      .on('click', '.eruda-refresh-script', () => {
        container.notify('Refreshed')
        this.refreshScript()._render()
      })
      .on('click', '.eruda-refresh-stylesheet', () => {
        container.notify('Refreshed')
        this.refreshStylesheet()._render()
      })
      .on('click', '.eruda-refresh-iframe', () => {
        container.notify('Refreshed')
        this.refreshIframe()._render()
      })
      .on('click', '.eruda-refresh-image', () => {
        container.notify('Refreshed')
        this.refreshImage()._render()
      })
      .on('click', '.eruda-search', function () {
        const $this = $(this)
        const type = $this.data('type')
        let filter = prompt('Filter')
        if (isNull(filter)) return
        filter = trim(filter)
        switch (type) {
          case 'local':
            self._localStoreSearchKeyword = filter
            break
          case 'session':
            self._sessionStoreSearchKeyword = filter
            break
          case 'cookie':
            self._cookieSearchKeyword = filter
            break
        }
        self._render()
      })
      .on('click', '.eruda-delete-storage', function () {
        const $this = $(this)
        const key = $this.data('key')
        const type = $this.data('type')

        if (type === 'local') {
          localStorage.removeItem(key)
          self.refreshLocalStorage()._render()
        } else {
          sessionStorage.removeItem(key)
          self.refreshSessionStorage()._render()
        }
      })
      .on('click', '.eruda-copy-storage', function () {
        const $this = $(this)
        const key = $this.data('key')
        const type = $this.data('type')
        const curValue = type === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key);

        copy(curValue, function() {
          copy(curValue, function() {
            $this.addClass('eruda-icon-check').rmClass('eruda-icon-copy');
            setTimeout(function(){
              $this.addClass('eruda-icon-copy').rmClass('eruda-icon-check');
            }, 1500);
          });
        });
      })
      .on('click', '.eruda-delete-cookie', function () {
        const key = $(this).data('key')

        chobitsu.domain('Network').deleteCookies({ name: key })
        self.refreshCookie()._render()
      })
      .on('click', '.eruda-copy-cookie', function () {
        const $this = $(this);
        const key = $this.data('key')
        const curValue = self._cookieData.find(function(it) { return it.key === key ? true : false; }).val

        copy(curValue, function() {
          $this.addClass('eruda-icon-check').rmClass('eruda-icon-copy');
          setTimeout(function(){
            $this.addClass('eruda-icon-copy').rmClass('eruda-icon-check');
          }, 1500);
        });
      })
      .on('click', '.eruda-clear-storage', function () {
        const type = $(this).data('type')

        if (type === 'local') {
          each(self._localStoreData, (val) => localStorage.removeItem(val.key))
          self.refreshLocalStorage()._render()
        } else {
          each(self._sessionStoreData, (val) =>
            sessionStorage.removeItem(val.key)
          )
          self.refreshSessionStorage()._render()
        }
      })
      .on('click', '.eruda-clear-cookie', () => {
        chobitsu.domain('Storage').clearDataForOrigin({
          storageTypes: 'cookies',
        })
        this.refreshCookie()._render()
      })
      .on('click', '.eruda-storage-val', function () {
        const $this = $(this)
        const key = $this.data('key')
        const type = $this.data('type')

        const val =
          type === 'local'
            ? localStorage.getItem(key)
            : sessionStorage.getItem(key)

        try {
          showSources('object', JSON.parse(val))
        } catch (e) {
          showSources('raw', val)
        }
      })
      .on('click', '.eruda-img-link', function () {
        const src = $(this).attr('src')

        showSources('img', src)
      })
      .on('click', '.eruda-css-link', linkFactory('css'))
      .on('click', '.eruda-js-link', linkFactory('js'))
      .on('click', '.eruda-iframe-link', linkFactory('iframe'))

    orientation.on('change', () => this._render())

    function showSources(type, data) {
      const sources = container.get('sources')
      if (!sources) return

      sources.set(type, data)

      container.showTool('sources')

      return true
    }

    function linkFactory(type) {
      return function (e) {
        if (!container.get('sources')) return
        e.preventDefault()

        const url = $(this).attr('href')

        if (type === 'iframe' || !sameOrigin(location.href, url)) {
          showSources('iframe', url)
        } else {
          ajax({
            url,
            success: (data) => {
              showSources(type, data)
            },
            dataType: 'raw',
          })
        }
      }
    }
  }
  _rmCfg() {
    const cfg = this.config

    const settings = this._container.get('settings')

    if (!settings) return

    settings
      .remove(cfg, 'hideErudaSetting')
      .remove(cfg, 'observeElement')
      .remove('Resources')
  }
  _initCfg() {
    const cfg = (this.config = Settings.createCfg('resources', {
      hideErudaSetting: true,
      observeElement: true,
    }))

    if (cfg.get('hideErudaSetting')) this._hideErudaSetting = true
    if (!cfg.get('observeElement')) this._observeElement = false

    cfg.on('change', (key, val) => {
      switch (key) {
        case 'hideErudaSetting':
          this._hideErudaSetting = val
          return
        case 'observeElement':
          this._observeElement = val
          return val ? this._enableObserver() : this._disableObserver()
      }
    })

    const settings = this._container.get('settings')
    settings
      .text('Resources')
      .switch(cfg, 'hideErudaSetting', 'Hide Eruda Setting')
      .switch(cfg, 'observeElement', 'Auto Refresh Elements')
      .separator()
  }
  _render() {
    const cookieData = this._cookieData
    const scriptData = this._scriptData
    const stylesheetData = this._stylesheetData
    const imageData = this._imageData

    const localStoreSearchKeyword = this._localStoreSearchKeyword
    const sessionStoreSearchKeyword = this._sessionStoreSearchKeyword
    const cookieSearchKeyword = this._cookieSearchKeyword

    function filterData(data, keyword) {
      keyword = lowerCase(keyword)

      if (!keyword) return data

      return filter(data, ({ key, val }) => {
        return (
          contain(lowerCase(key), keyword) || contain(lowerCase(val), keyword)
        )
      })
    }

    this._renderHtml(
      this._tpl({
        localStoreData: filterData(
          this._localStoreData,
          localStoreSearchKeyword
        ),
        localStoreSearchKeyword,
        sessionStoreData: filterData(
          this._sessionStoreData,
          sessionStoreSearchKeyword
        ),
        sessionStoreSearchKeyword,
        cookieData: filterData(cookieData, cookieSearchKeyword),
        cookieSearchKeyword,
        cookieState: getState('cookie', cookieData.length),
        scriptData,
        scriptState: getState('script', scriptData.length),
        stylesheetData,
        stylesheetState: getState('stylesheet', stylesheetData.length),
        iframeData: this._iframeData,
        imageData,
        imageState: getState('image', imageData.length),
      })
    )
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
  _initObserver() {
    this._observer = new MutationObserver((mutations) => {
      let needToRender = false
      each(mutations, (mutation) => {
        if (this._handleMutation(mutation)) needToRender = true
      })
      if (needToRender) this._render()
    })
  }
  _handleMutation(mutation) {
    if (isErudaEl(mutation.target)) return

    const checkEl = (el) => {
      const tagName = getLowerCaseTagName(el)
      switch (tagName) {
        case 'script':
          this.refreshScript()
          return true
        case 'img':
          this.refreshImage()
          return true
        case 'link':
          this.refreshStylesheet()
          return true
      }

      return false
    }

    if (mutation.type === 'attributes') {
      if (checkEl(mutation.target)) return true
    } else if (mutation.type === 'childList') {
      if (checkEl(mutation.target)) return true
      let nodes = toArr(mutation.addedNodes)
      nodes = concat(nodes, toArr(mutation.removedNodes))

      for (const node of nodes) {
        if (checkEl(node)) return true
      }
    }

    return false
  }
  _enableObserver() {
    this._observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  }
  _disableObserver() {
    this._observer.disconnect()
  }
}

function getState(type, len) {
  if (len === 0) return ''

  let warn = 0
  let danger = 0

  switch (type) {
    case 'cookie':
      warn = 30
      danger = 60
      break
    case 'script':
      warn = 5
      danger = 10
      break
    case 'stylesheet':
      warn = 4
      danger = 8
      break
    case 'image':
      warn = 50
      danger = 100
      break
  }

  if (len >= danger) return 'danger'
  if (len >= warn) return 'warn'

  return 'ok'
}

function getLowerCaseTagName(el) {
  if (!el.tagName) return ''
  return el.tagName.toLowerCase()
}

const sliceStr = (str, len) =>
  str.length < len ? str : str.slice(0, len) + '...'

const regImg = /\.(jpeg|jpg|gif|png)$/

const isImg = (url) => regImg.test(url)
