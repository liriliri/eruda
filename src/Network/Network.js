import Tool from '../DevTools/Tool'
import $ from 'licia/$'
import ms from 'licia/ms'
import each from 'licia/each'
import map from 'licia/map'
import Detail from './Detail'
import throttle from 'licia/throttle'
import { getFileName, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import chobitsu from '../lib/chobitsu'
import emitter from '../lib/emitter'
import NetworkDataGrid from './NetworkDataGrid'
import ResizeSensor from 'licia/ResizeSensor'
import MediaQuery from 'licia/MediaQuery'
import { getType } from './util'
import copy from 'licia/copy'
import extend from 'licia/extend'
import trim from 'licia/trim'
import isNull from 'licia/isNull'
import LunaModal from 'luna-modal'
import { curlStr } from './util'

export default class Network extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Network.scss'))

    this.name = 'network'
    this._requests = {}
    this._selectedRequest = null
    this._isRecording = true
  }
  init($el, container) {
    super.init($el)

    this._container = container
    this._initTpl()
    this._detail = new Detail(this._$detail, container)
    this._splitMediaQuery = new MediaQuery('screen and (min-width: 680px)')
    this._splitMode = this._splitMediaQuery.isMatch()
    this._requestDataGrid = new NetworkDataGrid(this._$requests.get(0), {
      columns: [
        {
          id: 'name',
          title: 'Name',
          sortable: true,
          weight: 45,
        },
        {
          id: 'method',
          title: 'Method',
          sortable: true,
          weight: 13,
        },
        {
          id: 'status',
          title: 'Status',
          sortable: true,
          weight: 10,
        },
        {
          id: 'size',
          title: 'Size',
          sortable: true,
          weight: 16,
        },
        {
          id: 'time',
          title: 'Time',
          sortable: true,
          weight: 16,
        },
      ],
    })
    this._resizeSensor = new ResizeSensor($el.get(0))
    this._bindEvent()
  }
  show() {
    super.show()
    this._updateDataGridHeight()
  }
  clear() {
    this._requests = {}
    this._requestDataGrid.clear()
  }
  requests() {
    const ret = []
    each(this._requests, (request) => {
      ret.push(request)
    })
    return ret
  }
  _updateDataGridHeight() {
    this._requestDataGrid.fit()
  }
  _reqWillBeSent = (params) => {
    if (!this._isRecording) {
      return
    }

    const request = {
      name: getFileName(params.request.url),
      url: params.request.url,
      status: 'pending',
      type: 'unknown',
      subType: 'unknown',
      size: 0,
      data: params.request.postData,
      method: params.request.method,
      startTime: params.timestamp * 1000,
      time: 0,
      resTxt: '',
      done: false,
      reqHeaders: params.request.headers || {},
      resHeaders: {},
    }
    let node
    request.render = () => {
      const data = {
        name: request.name,
        method: request.method,
        status: request.status,
        size: request.size,
        time: request.displayTime,
      }
      if (node) {
        node.data = data
        node.render()
      } else {
        node = this._requestDataGrid.append(data, { selectable: true })
        $(node.container).data('id', params.requestId)
      }
      if (request.hasErr) {
        $(node.container).addClass(c('request-error'))
      }
    }
    request.render()
    this._requests[params.requestId] = request
  }
  _resReceivedExtraInfo = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    request.resHeaders = params.headers

    this._updateType(request)
    request.render()
  }
  _updateType(request) {
    const contentType = request.resHeaders['content-type'] || ''
    const { type, subType } = getType(contentType)
    request.type = type
    request.subType = subType
  }
  _resReceived = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const { response } = params
    const { status, headers } = response
    request.status = status
    if (status < 200 || status >= 300) {
      request.hasErr = true
    }
    if (headers) {
      request.resHeaders = headers
      this._updateType(request)
    }

    request.render()
  }
  _loadingFinished = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const time = params.timestamp * 1000
    request.time = time - request.startTime
    request.displayTime = ms(request.time)

    request.size = params.encodedDataLength
    request.done = true
    request.resTxt = chobitsu.domain('Network').getResponseBody({
      requestId: params.requestId,
    }).body

    request.render()
  }
  _loadingFailed = (params) => {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const time = params.timestamp * 1000
    request.time = time - request.startTime
    request.displayTime = ms(request.time)

    request.hasErr = true
    request.status = 0
    request.done = true

    request.render()
  }
  _copyCurl = () => {
    const request = this._selectedRequest

    copy(
      curlStr({
        requestMethod: request.method,
        url() {
          return request.url
        },
        requestFormData() {
          return request.data
        },
        requestHeaders() {
          const reqHeaders = request.reqHeaders || {}
          extend(reqHeaders, {
            'User-Agent': navigator.userAgent,
            Referer: location.href,
          })

          return map(reqHeaders, (value, name) => {
            return {
              name,
              value,
            }
          })
        },
      }),
    )

    this._container.notify('Copied', { icon: 'success' })
  }
  _updateButtons() {
    const $control = this._$control
    const $copyCurl = $control.find(c('.copy-curl'))
    const iconDisabled = c('icon-disabled')

    $copyCurl.addClass(iconDisabled)

    if (this._selectedRequest) {
      $copyCurl.rmClass(iconDisabled)
    }
  }
  _toggleRecording = () => {
    this._$control.find(c('.record')).toggleClass(c('recording'))
    this._isRecording = !this._isRecording
  }
  _showDetail = () => {
    if (this._selectedRequest) {
      if (this._splitMode) {
        this._$network.css('width', '50%')
      }
      this._detail.show(this._selectedRequest)
    }
  }
  _bindEvent() {
    const $control = this._$control
    const $filterText = this._$filterText
    const requestDataGrid = this._requestDataGrid

    const self = this

    $control
      .on('click', c('.clear-request'), () => this.clear())
      .on('click', c('.copy-curl'), this._copyCurl)
      .on('click', c('.record'), this._toggleRecording)
      .on('click', c('.filter'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return

          $filterText.text(filter)
          requestDataGrid.setOption('filter', trim(filter))
        })
      })

    requestDataGrid.on('select', (node) => {
      const id = $(node.container).data('id')
      const request = self._requests[id]
      this._selectedRequest = request
      this._updateButtons()
      this._showDetail()
    })

    requestDataGrid.on('deselect', () => {
      this._selectedRequest = null
      this._updateButtons()
      if (this._$detail.css('display') !== 'none') this._detail.hide()
    })

    this._resizeSensor.addListener(
      throttle(() => this._updateDataGridHeight(), 15),
    )

    this._splitMediaQuery.on('match', () => {
      this._detail.hide()
      this._splitMode = true
    })
    this._splitMediaQuery.on('unmatch', () => {
      this._detail.hide()
      this._splitMode = false
    })
    this._detail.on('hide', () => {
      /** Returning to the list must let the same row be selected again. */
      if (requestDataGrid.selectedNode) requestDataGrid.selectNode(null)
      if (this._splitMode) {
        this._$network.css('width', '100%')
      }
    })

    chobitsu.domain('Network').enable()

    const network = chobitsu.domain('Network')
    network.on('requestWillBeSent', this._reqWillBeSent)
    network.on('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.on('responseReceived', this._resReceived)
    network.on('loadingFinished', this._loadingFinished)
    network.on('loadingFailed', this._loadingFailed)

    emitter.on(emitter.SCALE, this._updateScale)
  }
  _updateScale = (scale) => {
    this._splitMediaQuery.setQuery(`screen and (min-width: ${680 * scale}px)`)
  }
  destroy() {
    super.destroy()

    this._resizeSensor.destroy()
    evalCss.remove(this._style)
    this._splitMediaQuery.removeAllListeners()

    const network = chobitsu.domain('Network')
    network.off('requestWillBeSent', this._reqWillBeSent)
    network.off('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.off('responseReceived', this._resReceived)
    network.off('loadingFinished', this._loadingFinished)

    emitter.off(emitter.SCALE, this._updateScale)
  }
  _initTpl() {
    const $el = this._$el
    $el.html(
      c(`<div class="network">
        <div class="control">
          <span class="icon-record record recording"></span>
          <span class="icon-clear clear-request"></span>
          <span class="icon-copy icon-disabled copy-curl"></span>
          <span class="filter-text"></span>
          <span class="icon-filter filter"></span>
        </div>
        <div class="requests"></div>
      </div>
      <div class="detail"></div>`),
    )
    this._$network = $el.find(c('.network'))
    this._$detail = $el.find(c('.detail'))
    this._$requests = $el.find(c('.requests'))
    this._$control = $el.find(c('.control'))
    this._$filterText = $el.find(c('.filter-text'))
  }
}
