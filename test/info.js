describe('info', function () {
  let tool = eruda.get('info')
  let $tool = $('.eruda-info')

  describe('default', function () {
    it('location', function () {
      expect($tool.find('.eruda-content').eq(0)).toContainText(location.href)
    })

    it('updates location while info is visible', function () {
      const originalUrl = location.href
      const nextUrl = new URL(originalUrl)
      nextUrl.searchParams.set('eruda-info-route', 'push')

      jasmine.clock().install()
      eruda.show()
      eruda.show('info')

      try {
        history.pushState(null, '', nextUrl.toString())
        jasmine.clock().tick(101)
        expect($tool.find('.eruda-content').eq(0)).toContainText(
          nextUrl.toString()
        )

        nextUrl.searchParams.set('eruda-info-route', 'replace')
        nextUrl.hash = 'details'
        history.replaceState(null, '', nextUrl.toString())
        jasmine.clock().tick(101)
        expect($tool.find('.eruda-content').eq(0)).toContainText(
          nextUrl.toString()
        )
      } finally {
        history.replaceState(null, '', originalUrl)
        jasmine.clock().tick(101)
        eruda.hide()
        expect(tool._locationTimer).toBeNull()
        jasmine.clock().tick(301)
        eruda.show('console')
        jasmine.clock().uninstall()
      }
    })

    it('refreshes location when info is shown again', function () {
      const originalUrl = location.href
      const nextUrl = new URL(originalUrl)
      nextUrl.searchParams.set('eruda-info-route', 'reopen')

      eruda.show('console')

      try {
        history.replaceState(null, '', nextUrl.toString())
        eruda.show('info')
        expect($tool.find('.eruda-content').eq(0)).toContainText(
          nextUrl.toString()
        )
      } finally {
        history.replaceState(null, '', originalUrl)
        eruda.show('console')
      }
    })

    it('user agent', function () {
      expect($tool.find('.eruda-content').eq(1)).toContainText(
        navigator.userAgent
      )
    })

    it('device', function () {
      expect($tool.find('.eruda-content').eq(2)).toContainText(
        window.innerWidth
      )
    })

    it('system', function () {
      expect($tool.find('.eruda-content').eq(3)).toContainText('os')
    })

    it('sponsor', function () {
      expect($tool.find('.eruda-content').eq(4)).toContainText(
        'Open Collective'
      )
    })

    it('about', function () {
      expect($tool.find('.eruda-content').eq(5)).toHaveText(/Eruda v[\d.]+/)
    })
  })

  it('clear', function () {
    tool.clear()
    expect($tool.find('li')).toHaveLength(0)
  })

  it('add', function () {
    tool.add('test', 'eruda')
    expect($tool.find('.eruda-title')).toContainText('test')
    expect($tool.find('.eruda-content')).toContainText('eruda')
    tool.add('test', 'update')
    tool.add('test', 'update')
    expect($tool.find('.eruda-content')).toContainText('update')
  })

  it('get', function () {
    expect(tool.get()).toEqual([{ name: 'test', val: 'update' }])
    expect(tool.get('test')).toBe('update')
    expect(tool.get('test2')).not.toBeDefined()
  })

  it('remove', function () {
    tool.remove('test')
    expect($tool.find('li')).toHaveLength(0)
  })
})
