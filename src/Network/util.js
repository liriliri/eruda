import last from 'licia/last'
import detectOs from 'licia/detectOs'
import arrToMap from 'licia/arrToMap'

export function getType(contentType) {
  if (!contentType) return 'unknown'

  const type = contentType.split(';')[0].split('/')

  return {
    type: type[0],
    subType: last(type),
  }
}

export function curlStr(request) {
  let platform = detectOs()
  if (platform === 'windows') {
    platform = 'win'
  }
  let command = []
  const ignoredHeaders = arrToMap([
    'accept-encoding',
    'host',
    'method',
    'path',
    'scheme',
    'version',
  ])

  function escapeStringWin(str) {
    const encapsChars = /[\r\n]/.test(str) ? '^"' : '"'
    return (
      encapsChars +
      str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/[^a-zA-Z0-9\s_\-:=+~'/.',?;()*`&]/g, '^$&')
        .replace(/%(?=[a-zA-Z0-9_])/g, '%^')
        .replace(/\r?\n/g, '^\n\n') +
      encapsChars
    )
  }

  function escapeStringPosix(str) {
    function escapeCharacter(x) {
      const code = x.charCodeAt(0)
      let hexString = code.toString(16)
      while (hexString.length < 4) {
        hexString = '0' + hexString
      }

      return '\\u' + hexString
    }

    // eslint-disable-next-line no-control-regex
    if (/[\0-\x1F\x7F-\x9F!]|'/.test(str)) {
      return (
        "$'" +
        str
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          // eslint-disable-next-line no-control-regex
          .replace(/[\0-\x1F\x7F-\x9F!]/g, escapeCharacter) +
        "'"
      )
    }
    return "'" + str + "'"
  }

  const escapeString = platform === 'win' ? escapeStringWin : escapeStringPosix

  command.push(escapeString(request.url()).replace(/[[{}\]]/g, '\\$&'))

  let inferredMethod = 'GET'
  const data = []
  const formData = request.requestFormData()
  if (formData) {
    data.push('--data-raw ' + escapeString(formData))
    ignoredHeaders['content-length'] = true
    inferredMethod = 'POST'
  }

  if (request.requestMethod !== inferredMethod) {
    command.push('-X ' + escapeString(request.requestMethod))
  }

  const requestHeaders = request.requestHeaders()
  for (let i = 0; i < requestHeaders.length; i++) {
    const header = requestHeaders[i]
    const name = header.name.replace(/^:/, '')
    if (ignoredHeaders[name.toLowerCase()]) {
      continue
    }
    command.push('-H ' + escapeString(name + ': ' + header.value))
  }
  command = command.concat(data)
  command.push('--compressed')

  return (
    'curl ' +
    command.join(
      command.length >= 3 ? (platform === 'win' ? ' ^\n  ' : ' \\\n  ') : ' '
    )
  )
}
