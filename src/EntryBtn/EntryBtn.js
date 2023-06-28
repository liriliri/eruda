import emitter from '../lib/emitter'
import Settings from '../Settings/Settings'
import Emitter from 'licia/Emitter'
import $ from 'licia/$'
import nextTick from 'licia/nextTick'
import orientation from 'licia/orientation'
import { pxToNum, classPrefix as c, dragEvents, eventClient } from '../lib/util'
import evalCss from '../lib/evalCss'

const $document = $(document)

export default class EntryBtn extends Emitter {
  constructor($container) {
    super()

    this._style = evalCss(require('./EntryBtn.scss'))

    this._$container = $container
    this._initTpl()
    this._bindEvent()
    this._registerListener()
  }
  hide() {
    this._$el.hide()
  }
  show() {
    this._$el.show()
  }
  setPos(pos) {
    if (this._isOutOfRange(pos)) {
      pos = this._getDefPos()
    }

    this._$el.css({
      left: pos.x,
      top: pos.y,
    })

    this.config.set('pos', pos)
  }
  getPos() {
    return this.config.get('pos')
  }
  destroy() {
    evalCss.remove(this._style)
    this._unregisterListener()
    this._$el.remove()
  }
  _isOutOfRange(pos) {
    pos = pos || this.config.get('pos')
    const defPos = this._getDefPos()

    return (
      pos.x > defPos.x + 10 || pos.x < 0 || pos.y < 0 || pos.y > defPos.y + 10
    )
  }
  _registerListener() {
    this._scaleListener = () =>
      nextTick(() => {
        if (this._isOutOfRange()) this._resetPos()
      })
    emitter.on(emitter.SCALE, this._scaleListener)
  }
  _unregisterListener() {
    emitter.off(emitter.SCALE, this._scaleListener)
  }
  _initTpl() {
    const $container = this._$container

    $container.append(
      c('<div class="entry-btn"><span class="icon-tool"></span></div>')
    )
    this._$el = $container.find('.eruda-entry-btn')
  }
  _resetPos(orientationChanged) {
    const cfg = this.config
    let pos = cfg.get('pos')
    const defPos = this._getDefPos()

    if (!cfg.get('rememberPos') || orientationChanged) {
      pos = defPos
    }

    this.setPos(pos)
  }
  _onDragStart = (e) => {
    e.preventDefault()

    const $el = this._$el
    $el.addClass(c('active'))

    this._isClick = true
    e = e.origEvent
    this._startX = eventClient('x', e)
    this._oldX = pxToNum($el.css('left'))
    this._oldY = pxToNum($el.css('top'))
    this._startY = eventClient('y', e)
    dragEvents('move').forEach(e => $document.on(e, this._onDragMove))
    dragEvents('end').forEach(e => $document.on(e, this._onDragEnd))
  }
  _onDragMove = (e) => {
    const btnSize = this._$el.get(0).offsetWidth
    const maxWidth = this._$container.get(0).offsetWidth
    const maxHeight = this._$container.get(0).offsetHeight

    e = e.origEvent
    const deltaX = eventClient('x', e) - this._startX
    const deltaY = eventClient('y', e) - this._startY
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      this._isClick = false
    }
    let newX = this._oldX + deltaX
    let newY = this._oldY + deltaY
    if (newX < 0) {
      newX = 0
    } else if (newX > maxWidth - btnSize) {
      newX = maxWidth - btnSize
    }
    if (newY < 0) {
      newY = 0
    } else if (newY > maxHeight - btnSize) {
      newY = maxHeight - btnSize
    }
    this._$el.css({
      left: newX,
      top: newY,
    })
  }
  _onDragEnd = (e) => {
    const $el = this._$el

    if (this._isClick) {
      this.emit('click')
    }

    this._onDragMove(e)
    dragEvents('move').forEach(e => $document.off(e, this._onDragMove))
    dragEvents('end').forEach(e => $document.off(e, this._onDragEnd))

    const cfg = this.config

    if (cfg.get('rememberPos')) {
      cfg.set('pos', {
        x: pxToNum($el.css('left')),
        y: pxToNum($el.css('top')),
      })
    }

    $el.rmClass('eruda-active')
  }
  _bindEvent() {
    const $el = this._$el

    dragEvents('start').forEach(e => $el.on(e, this._onDragStart))

    orientation.on('change', () => this._resetPos(true))
    window.addEventListener('resize', () => this._resetPos())
  }
  initCfg(settings) {
    const cfg = (this.config = Settings.createCfg('entry-button', {
      rememberPos: true,
      pos: this._getDefPos(),
    }))

    settings.switch(cfg, 'rememberPos', 'Remember Entry Button Position')

    this._resetPos()
  }
  _getDefPos() {
    const minWidth = this._$el.get(0).offsetWidth + 10

    return {
      x: window.innerWidth - minWidth,
      y: window.innerHeight - minWidth,
    }
  }
}
