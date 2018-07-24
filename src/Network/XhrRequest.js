import { getType, lenToUtf8Bytes } from './util'
import {
  Emitter,
  fullUrl,
  uniqId,
  isStr,
  getFileName,
  now,
  each,
  trim,
  isCrossOrig,
  toNum,
  fileSize
} from '../lib/util'

export default class XhrRequest extends Emitter {
  constructor(xhr, method, url) {
    super()

    this._xhr = xhr
    this._method = method
    this._url = fullUrl(url)
    this._id = uniqId('request')
  }
  handleSend(data) {
    if (!isStr(data)) data = ''

    this.emit('send', this._id, {
      name: getFileName(this._url),
      url: this._url,
      data,
      method: this._method
    })
  }
  handleHeadersReceived() {
    let xhr = this._xhr

    let type = getType(xhr.getResponseHeader('Content-Type'))

    this.emit('update', this._id, {
      type: type.type,
      subType: type.subType,
      size: getSize(xhr, true, this._url),
      time: now(),
      resHeaders: getHeaders(xhr),
      reqHeaders: (xhr.erudaRequest && xhr.erudaRequest._headers) || null
    })
  }
  handleDone() {
    let xhr = this._xhr,
      resType = xhr.responseType

    let resTxt =
      resType === '' || resType === 'text' || resType === 'json'
        ? xhr.responseText
        : ''

    this.emit('update', this._id, {
      status: xhr.status,
      done: true,
      size: getSize(xhr, false, this._url),
      time: now(),
      resTxt: resTxt
    })
  }
}

function getHeaders(xhr) {
  let raw = xhr.getAllResponseHeaders(),
    lines = raw.split('\n')

  let ret = {}

  each(lines, line => {
    line = trim(line)

    if (line === '') return

    let [key, val] = line.split(':', 2)

    ret[key] = trim(val)
  })

  return ret
}

function getSize(xhr, headersOnly, url) {
  let size = 0

  function getStrSize() {
    if (!headersOnly) {
      let resType = xhr.responseType
      let resTxt =
        resType === '' || resType === 'text' || resType === 'json'
          ? xhr.responseText
          : ''
      if (resTxt) size = lenToUtf8Bytes(resTxt)
    }
  }

  if (isCrossOrig(url)) {
    getStrSize()
  } else {
    try {
      size = toNum(xhr.getResponseHeader('Content-Length'))
    } catch (e) {
      getStrSize()
    }
  }

  if (size === 0) getStrSize()

  return `${fileSize(size)}B`
}
