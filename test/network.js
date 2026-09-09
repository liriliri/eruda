describe('network', function () {
  let tool = eruda.get('network')

  beforeEach(function () {
    eruda.show('network')
  })

  describe('request', function () {
    it('xhr', function (done) {
      $('.eruda-clear-xhr').click()
      util.ajax.get(window.location.toString(), function () {
        setTimeout(function () {
          expect($('.eruda-requests .luna-data-grid-node')).toHaveLength(1)
          done()
        }, 500)
      })
    })

    it('opens detail from the row and keeps only useful columns', function (done) {
      tool.clear()
      tool._reqWillBeSent({
        requestId: 'row-detail-test',
        timestamp: Date.now() / 1000,
        request: {
          url: 'https://example.com/api/row-detail',
          method: 'GET',
          headers: {},
        },
      })

      setTimeout(function () {
        const headers = $('.eruda-requests th')
          .map(function () {
            return $(this).text().trim()
          })
          .get()
        const columnWeights = tool._requestDataGrid.options.columns.map(
          (column) => column.weight,
        )
        const $row = $('.eruda-requests .luna-data-grid-node').last()

        expect(headers).toEqual(['Name', 'Method', 'Status', 'Size', 'Time'])
        expect(columnWeights).toEqual([45, 13, 10, 16, 16])
        expect($('.eruda-network .eruda-show-detail')).toHaveLength(0)
        expect(parseFloat($row.find('td').eq(0).css('height'))).toBe(32)
        expect($row).toHaveClass('luna-data-grid-selectable')

        $row.get(0).dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(tool._requestDataGrid.selectedNode).toBe(
          $row.get(0).dataGridNode,
        )
        expect(tool._selectedRequest.url).toBe(
          'https://example.com/api/row-detail',
        )
        expect(tool._$detail.get(0).style.display).toBe('block')

        tool._detail.hide()
        $row.get(0).dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(tool._$detail.get(0).style.display).toBe('block')
        tool._detail.hide()
        done()
      }, 50)
    })

    it('keeps virtual scrolling aligned with the larger rows', function (done) {
      tool.clear()
      for (let i = 0; i < 250; i++) {
        tool._requestDataGrid.append(
          {
            name: `request-${i}`,
            method: 'GET',
            status: 200,
            size: i,
            time: '1ms',
          },
          { selectable: true },
        )
      }

      setTimeout(function () {
        expect(tool._requestDataGrid.spaceHeight).toBe(8000)
        expect($('.eruda-requests .luna-data-grid-node').length).toBeLessThan(
          250,
        )
        tool.clear()
        done()
      }, 50)
    })
  })

  describe('detail copy', function () {
    let copiedText = ''

    beforeEach(function () {
      copiedText = ''
      spyOn(document, 'execCommand').and.callFake(function (command) {
        if (command === 'copy') {
          /**
           * licia/copy removes its temporary textarea immediately after this call.
           */
          copiedText = $('body > textarea[readonly]').last().val()
        }
        return true
      })

      tool._detail.show({
        method: 'POST',
        url: 'https://example.com/api/users?name=eruda&enabled=true#section',
        status: 200,
        data: '{"enabled":true}',
        reqHeaders: {
          'Content-Type': 'application/json',
          'X-Test': 'request',
        },
        resHeaders: {
          'Content-Type': 'application/json',
          'X-Test': 'response',
        },
        resTxt: '{"ok":true}',
      })
    })

    afterEach(function () {
      tool._detail.hide()
    })

    it('keeps copy all in the menu without a standalone icon', function () {
      expect($('.eruda-copy-res')).toHaveLength(0)

      $('.eruda-copy-menu-toggle').click()
      $('.eruda-copy-menu-item[data-copy-field="all"]').click()

      expect(copiedText).toBe(
        'POST https://example.com/api/users?name=eruda&enabled=true#section 200\n' +
          '\nRequest Data\n\n' +
          '{"enabled":true}\n' +
          '\nRequest Headers\n\n' +
          'Content-Type: application/json\n' +
          'X-Test: request\n' +
          '\nResponse Headers\n\n' +
          'Content-Type: application/json\n' +
          'X-Test: response\n' +
          '\n{"ok":true}\n',
      )
    })

    it('copies individual request and response fields', function () {
      const expectedValues = {
        url: 'https://example.com/api/users?name=eruda&enabled=true#section',
        query: 'name=eruda&enabled=true',
        requestBody: '{"enabled":true}',
        requestHeaders: 'Content-Type: application/json\nX-Test: request',
        responseHeaders: 'Content-Type: application/json\nX-Test: response',
        responseBody: '{"ok":true}',
      }

      Object.keys(expectedValues).forEach(function (field) {
        $('.eruda-copy-menu-toggle').click()
        expect($('.eruda-copy-menu')).toHaveClass('eruda-copy-menu-visible')

        $(`.eruda-copy-menu-item[data-copy-field="${field}"]`).click()

        expect(copiedText).toBe(expectedValues[field])
        expect($('.eruda-copy-menu')).not.toHaveClass('eruda-copy-menu-visible')
      })
    })

    it('disables fields without copyable content', function () {
      tool._detail.show({
        method: 'GET',
        url: 'https://example.com/health',
        status: 204,
        reqHeaders: {},
        resHeaders: {},
      })

      $('.eruda-copy-menu-toggle').click()
      const $emptyItems = $('.eruda-copy-menu-item').filter(function () {
        return (
          $(this).data('copy-field') !== 'all' &&
          $(this).data('copy-field') !== 'url'
        )
      })

      expect($emptyItems).toHaveClass('eruda-copy-menu-item-disabled')
      $emptyItems.eq(0).click()
      expect(document.execCommand).not.toHaveBeenCalled()
    })
  })

  describe('detail content', function () {
    beforeEach(function () {
      tool._detail.show({
        method: 'POST',
        url: 'https://example.com/api/users',
        status: 200,
        data: '{"enabled":true}',
        reqHeaders: {
          'Content-Type': 'application/json',
        },
        resHeaders: {
          'Content-Type': 'application/json',
        },
        resTxt: '{"ok":true}',
      })
    })

    afterEach(function () {
      tool._detail.hide()
    })

    it('formats request and response JSON for display', function () {
      expect($('.eruda-data').text()).toBe('{\n  "enabled": true\n}')
      expect($('.eruda-response').text()).toBe('{\n  "ok": true\n}')
    })

    it('opens JSON request data in Sources', function () {
      const sources = eruda.get('sources')
      spyOn(sources, 'set').and.callThrough()

      $('.eruda-data').click()

      expect(sources.set).toHaveBeenCalledWith('object', '{"enabled":true}')
      expect($('.eruda-source-search')).toHaveLength(1)
    })

    it('opens form request data as raw source', function () {
      const sources = eruda.get('sources')
      spyOn(sources, 'set').and.callThrough()
      tool._detail.show({
        method: 'POST',
        url: 'https://example.com/api/form',
        status: 200,
        data: 'keyword=needle&enabled=true',
        reqHeaders: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        resHeaders: {},
      })

      $('.eruda-data').click()

      expect(sources.set).toHaveBeenCalledWith(
        'raw',
        'keyword=needle&enabled=true',
      )
    })

    it('keeps body blocks out of the vertical scroll chain', function () {
      const dataStyle = getComputedStyle($('.eruda-data').get(0))
      const responseStyle = getComputedStyle($('.eruda-response').get(0))

      expect(dataStyle.overflowY).toBe('visible')
      expect(responseStyle.overflowY).toBe('visible')
    })

    it('finds and navigates detail matches', function () {
      $('.eruda-detail-search-input').val('true')
      tool._detail._applySearch()

      const $matches = $('.eruda-detail-search-match')
      expect($matches).toHaveLength(2)
      expect($('.eruda-detail-search-count').text()).toBe('1/2')
      expect($matches.eq(0)).toHaveClass('eruda-detail-search-match-active')

      $('.eruda-detail-search-next').click()
      expect($('.eruda-detail-search-count').text()).toBe('2/2')
      expect($matches.eq(1)).toHaveClass('eruda-detail-search-match-active')

      $('.eruda-detail-search-prev').click()
      expect($('.eruda-detail-search-count').text()).toBe('1/2')
      expect($matches.eq(0)).toHaveClass('eruda-detail-search-match-active')
    })

    it('caps highlighted nodes for high-frequency matches', function () {
      tool._detail.show({
        method: 'POST',
        url: 'https://example.com/api/search',
        status: 200,
        data: JSON.stringify({ value: Array(251).join('x') }),
        reqHeaders: {},
        resHeaders: {},
      })

      $('.eruda-detail-search-input').val('x')
      tool._detail._applySearch()

      expect($('.eruda-detail-search-match')).toHaveLength(200)
      expect($('.eruda-detail-search-count').text()).toBe('1/200+')
    })

    it('skips JSON parsing and truncates oversized display bodies', function () {
      const largeBody = '{"value":"' + Array(100002).join('x') + '"}'
      spyOn(JSON, 'parse').and.callThrough()

      tool._detail.show({
        method: 'POST',
        url: 'https://example.com/api/large',
        status: 200,
        data: largeBody,
        reqHeaders: {},
        resHeaders: {},
      })

      expect(JSON.parse).not.toHaveBeenCalled()
      expect($('.eruda-data').text().length).not.toBeGreaterThan(100000)
    })
  })
})
