const API_PREFIX = '/api/network-detail/'
const KEYWORD = 'needle'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (!url.pathname.startsWith(API_PREFIX)) return

  event.respondWith(handleRequest(event.request, url))
})

/** Build deterministic rows so scrolling and keyword navigation are repeatable. */
function createRows(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `network-detail-row-${index + 1}`,
    marker: index % 7 === 0 ? KEYWORD : 'ordinary-value',
    description: `This is deterministic response content for row ${index + 1}.`,
  }))
}

/** Return JSON with explicit headers so response headers can also be inspected. */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Eruda-Demo': 'network-detail',
    },
  })
}

async function handleRequest(request, url) {
  const route = url.pathname.slice(API_PREFIX.length)

  if (route === 'get') {
    return jsonResponse({
      ok: true,
      query: Object.fromEntries(url.searchParams),
      keyword: KEYWORD,
      rows: createRows(120),
    })
  }

  if (route === 'post') {
    let requestBody
    try {
      requestBody = await request.json()
    } catch (error) {
      requestBody = { parseError: error.message }
    }

    return jsonResponse(
      {
        ok: true,
        received: requestBody,
        keyword: KEYWORD,
        rows: createRows(90),
      },
      201,
    )
  }

  if (route === 'huge') {
    return jsonResponse({
      ok: true,
      keyword: KEYWORD,
      note: 'The payload below intentionally exceeds the 100 KB display limit.',
      payload: 'x'.repeat(130000),
    })
  }

  if (route === 'invalid-json') {
    return new Response('{"ok": true, "broken": ', {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }

  return jsonResponse({ ok: false, message: 'Unknown demo route' }, 404)
}
