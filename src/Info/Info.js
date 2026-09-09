import Tool from '../DevTools/Tool'
import defInfo from './defInfo'
import each from 'licia/each'
import isFn from 'licia/isFn'
import isUndef from 'licia/isUndef'
import cloneDeep from 'licia/cloneDeep'
import evalCss from '../lib/evalCss'
import map from 'licia/map'
import escape from 'licia/escape'
import copy from 'licia/copy'
import $ from 'licia/$'
import { classPrefix as c } from '../lib/util'

export default class Info extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Info.scss'))

    this.name = 'info'
    this._infos = []
    this._lastLocation = location.href
    this._locationTimer = null
  }
  init($el, container) {
    super.init($el)
    this._container = container

    this._addDefInfo()
    this._bindEvent()
  }
  destroy() {
    this._stopLocationWatcher()
    this._container.off('show', this._handleContainerShow)
    this._container.off('hide', this._handleContainerHide)
    super.destroy()

    evalCss.remove(this._style)
  }
  show() {
    super.show()

    this._render()
    if (this._container._isShow) this._startLocationWatcher()

    return this
  }
  hide() {
    super.hide()

    this._stopLocationWatcher()

    return this
  }
  add(name, val) {
    const infos = this._infos
    let isUpdate = false

    each(infos, (info) => {
      if (name !== info.name) return

      info.val = val
      isUpdate = true
    })

    if (!isUpdate) infos.push({ name, val })

    this._render()

    return this
  }
  get(name) {
    const infos = this._infos

    if (isUndef(name)) {
      return cloneDeep(infos)
    }

    let result

    each(infos, (info) => {
      if (name === info.name) result = info.val
    })

    return result
  }
  remove(name) {
    const infos = this._infos

    for (let i = infos.length - 1; i >= 0; i--) {
      if (infos[i].name === name) infos.splice(i, 1)
    }

    this._render()

    return this
  }
  clear() {
    this._infos = []

    this._render()

    return this
  }
  _addDefInfo() {
    each(defInfo, (info) => this.add(info.name, info.val))
  }
  _render() {
    const infos = []

    each(this._infos, ({ name, val }) => {
      if (isFn(val)) val = val()

      infos.push({ name, val })
    })

    const html = `<ul>${map(
      infos,
      (info) =>
        `<li><h2 class="${c('title')}">${escape(info.name)}<span class="${c(
          'icon-copy copy'
        )}"></span></h2><div class="${c('content')}">${info.val}</div></li>`
    ).join('')}</ul>`

    this._renderHtml(html)
  }
  _bindEvent() {
    const container = this._container

    container.on('show', this._handleContainerShow)
    container.on('hide', this._handleContainerHide)

    this._$el.on('click', c('.copy'), function () {
      const $li = $(this).parent().parent()
      const name = $li.find(c('.title')).text()
      const content = $li.find(c('.content')).text()
      copy(`${name}: ${content}`)
      container.notify('Copied', { icon: 'success' })
    })
  }
  _handleContainerShow = () => {
    if (!this.active) return

    this._render()
    this._startLocationWatcher()
  }
  _handleContainerHide = () => {
    this._stopLocationWatcher()
  }
  /**
   * History pushState and replaceState do not emit navigation events, so compare
   * the complete URL while Info is visible without patching host page APIs.
   */
  _startLocationWatcher() {
    this._stopLocationWatcher()
    this._lastLocation = location.href
    this._locationTimer = setInterval(() => {
      const currentLocation = location.href
      if (currentLocation === this._lastLocation) return

      this._lastLocation = currentLocation
      this._render()
    }, LOCATION_UPDATE_INTERVAL)
  }
  _stopLocationWatcher() {
    if (this._locationTimer === null) return

    clearInterval(this._locationTimer)
    this._locationTimer = null
  }
  _renderHtml(html) {
    if (html === this._lastHtml) return
    this._lastHtml = html
    this._$el.html(html)
  }
}

const LOCATION_UPDATE_INTERVAL = 100
