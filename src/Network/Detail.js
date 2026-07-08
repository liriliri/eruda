import trim from 'licia/trim'
import isEmpty from 'licia/isEmpty'
import map from 'licia/map'
import each from 'licia/each'
import escape from 'licia/escape'
import copy from 'licia/copy'
import isJson from 'licia/isJson'
import Emitter from 'licia/Emitter'
import truncate from 'licia/truncate'
import { classPrefix as c } from '../lib/util'

const MAX_RES_LEN = 100000

export default class Detail extends Emitter {
  constructor($container, devtools) {
    super()
    this._$container = $container
    this._devtools = devtools

    this._detailData = {}
    this._bindEvent()
  }
  show(data) {
    if (data.resTxt && trim(data.resTxt) === '') {
      delete data.resTxt
    }
    if (isEmpty(data.resHeaders)) {
      delete data.resHeaders
    }
    if (isEmpty(data.reqHeaders)) {
      delete data.reqHeaders
    }

    const html = `<div class="${c('control')}">
      <span class="${c('icon-left back')}"></span>
      <span class="${c('icon-delete back')}"></span>
      <span class="${c('url')}">${escape(data.url)}</span>
      <span class="${c('icon-copy copy-res')}"></span>
    </div>
    <div class="${c('http')}">
      ${buildGeneralSection(data)}
      ${buildQuerySection(data)}
      ${buildPayloadSection(data)}
      ${buildHeadersSection('Request Headers', data.reqHeaders)}
      ${buildHeadersSection('Response Headers', data.resHeaders)}
      ${buildResponseSection(data)}
    </div>`

    this._$container.html(html).show()
    this._detailData = data
  }
  hide() {
    this._$container.hide()
    this.emit('hide')
  }
  _copyRes = () => {
    const detailData = this._detailData

    let data = `${detailData.method} ${detailData.url} ${detailData.status}\n`
    if (!isEmpty(detailData.data)) {
      data += '\nRequest Data\n\n'
      data += `${detailData.data}\n`
    }
    if (!isEmpty(detailData.reqHeaders)) {
      data += '\nRequest Headers\n\n'
      each(detailData.reqHeaders, (val, key) => (data += `${key}: ${val}\n`))
    }
    if (!isEmpty(detailData.resHeaders)) {
      data += '\nResponse Headers\n\n'
      each(detailData.resHeaders, (val, key) => (data += `${key}: ${val}\n`))
    }
    if (detailData.resTxt) {
      data += `\n${detailData.resTxt}\n`
    }

    copy(data)
    this._devtools.notify('Copied', { icon: 'success' })
  }
  _bindEvent() {
    const devtools = this._devtools

    this._$container
      .on('click', c('.back'), () => this.hide())
      .on('click', c('.copy-res'), this._copyRes)
      .on('click', c('.http .response'), () => {
        const data = this._detailData
        const resTxt = data.resTxt

        if (isJson(resTxt)) {
          return showSources('object', resTxt)
        }

        switch (data.subType) {
          case 'css':
            return showSources('css', resTxt)
          case 'html':
            return showSources('html', resTxt)
          case 'javascript':
            return showSources('js', resTxt)
          case 'json':
            return showSources('object', resTxt)
        }
        switch (data.type) {
          case 'image':
            return showSources('img', data.url)
        }
      })

    const showSources = (type, data) => {
      const sources = devtools.get('sources')
      if (!sources) {
        return
      }

      sources.set(type, data)

      devtools.showTool('sources')
    }
  }
}

/** kv object to table html */
function buildRows(obj) {
  return map(obj, (val, key) => {
    return `<tr>
      <td class="${c('key')}">${escape(key)}</td>
      <td>${escape(val)}</td>
    </tr>`
  }).join('')
}

/** table section: title + table */
function buildSection(title, rows) {
  return `<div class="${c('section')}">
    <h2>${title}</h2>
    <table class="${c('headers')}">
      <tbody>
        ${rows || '<tr><td>Empty</td></tr>'}
      </tbody>
    </table>
  </div>`
}

/** raw section: title + pre */
function buildRawSection(title, text, cls = 'payload-raw') {
  return `<div class="${c('section')}">
    <h2>${title}</h2>
    <pre class="${c(cls)}">${escape(text)}</pre>
  </div>`
}

function buildGeneralSection(data) {
  const rows = []

  rows.push(
    `<tr><td class="${c('key')}">Request URL</td><td>${escape(data.url)}</td></tr>`,
  )
  rows.push(
    `<tr><td class="${c('key')}">Request Method</td><td>${escape(data.method || '')}</td></tr>`,
  )
  rows.push(
    `<tr><td class="${c('key')}">Status Code</td><td>${escape(String(data.status || ''))}</td></tr>`,
  )

  const reqContentType =
    (data.reqHeaders &&
      (data.reqHeaders['content-type'] || data.reqHeaders['Content-Type'])) ||
    ''
  if (reqContentType) {
    rows.push(
      `<tr><td class="${c('key')}">Content-Type</td><td>${escape(reqContentType)}</td></tr>`,
    )
  }

  return buildSection('General', rows.join(''))
}

function buildQuerySection(data) {
  let params = {}
  try {
    const urlObj = new URL(data.url, location.href)
    urlObj.searchParams.forEach((val, key) => {
      params[key] = val
    })
  } catch {
    params = {}
  }

  if (isEmpty(params)) return ''

  return buildSection('Query String Parameters', buildRows(params))
}

function buildPayloadSection(data) {
  const rawStr = data.data == null ? '' : String(data.data)
  if (!trim(rawStr)) return ''

  // Only parse as table if the request header is explicitly form-urlencoded, otherwise display as raw
  const contentType =
    (data.reqHeaders &&
      (data.reqHeaders['content-type'] || data.reqHeaders['Content-Type'])) ||
    ''

  if (contentType.includes('application/x-www-form-urlencoded')) {
    try {
      const params = {}
      new URLSearchParams(rawStr).forEach((val, key) => {
        params[key] = val
      })
      if (!isEmpty(params)) {
        return buildSection('Request Payload', buildRows(params))
      }
    } catch {
      // fall through to raw display
    }
  }

  return buildRawSection('Request Payload', rawStr)
}

function buildHeadersSection(title, headers) {
  return buildSection(title, headers ? buildRows(headers) : '')
}

function buildResponseSection(data) {
  if (!data.resTxt) return ''

  let text = data.resTxt
  if (text.length > MAX_RES_LEN) {
    text = truncate(text, MAX_RES_LEN)
  }

  return buildRawSection('Response Body', text, 'response')
}
