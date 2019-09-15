describe('console', function() {
  let tool = eruda.get('console')
  let $tool = $('.eruda-console')

  beforeEach(function() {
    eruda.show('console')
    tool.clear()
  })

  it('string', function() {
    let text = '<span>This is a log</span>'

    tool.log(text)
    expect($tool.find('.eruda-log')).toContainText(text)
  })

  it('clear', function() {
    expect($tool.find('.eruda-logs li')).toHaveLength(0)
  })

  it('recognize url', function() {
    tool.log('http://liriliri.github.io/eruda/?plugin=fps')
    expect($tool.find('.eruda-log')).toContainHtml(
      '<a href="http://liriliri.github.io/eruda/?plugin=fps" target="_blank">http://liriliri.github.io/eruda/?plugin=fps</a>'
    )
  })

  it('basic object', function() {
    let obj = { a: 1 }

    tool.log(obj)
    expect($tool.find('.eruda-log')).toContainText('Object { a: 1 }')
    $tool.find('.eruda-log').click()
  })

  it('html', function() {
    tool.html('<span class="color-blue">Blue</span>')
    expect($tool.find('.eruda-html')).toContainElement('span.color-blue')
  })

  it('timing', function() {
    tool.time('eruda')
    tool.timeEnd('eruda')
    expect($tool.find('.eruda-html')).toHaveText(/eruda: [.\d]+ms/)
  })

  it('error', function() {
    tool.error(new Error('error test'))
    expect($tool.find('.eruda-error')).toContainElement('.eruda-stack')
    expect($tool.find('.eruda-error')).toContainText('error test')
  })

  it('assert', function() {
    tool.assert(true, 'assert')
    expect($tool.find('.eruda-log-item')).toHaveLength(0)

    tool.assert(false, 'assert')
    expect($tool.find('.eruda-error')).toHaveLength(1)
  })

  it('count', function() {
    tool.count('test').clear()
    tool.count('test')
    expect($tool.find('.eruda-html')).toContainText('test: 2')
  })

  it('group', function() {
    tool.group('testGroup')
    expect($tool.find('.eruda-group')).toHaveLength(1)
    expect($tool.find('.eruda-group-container')).toHaveLength(1)
    expect($tool.find('.eruda-group-container.eruda-hidden')).toHaveLength(0)
    expect($tool.find('.eruda-icon-group')).toHaveLength(1)
    $tool.find('.eruda-group').click()
    expect($tool.find('.eruda-icon-groupCollapsed')).toHaveLength(1)
    expect($tool.find('.eruda-group-container.eruda-hidden')).toHaveLength(1)
    tool.log('test')
    expect($tool.find('.eruda-group-container').find('.eruda-log')).toContainText('test')
    tool.groupEnd()
    tool.log('test')
    expect($tool.find('.eruda-group-container').find('.eruda-log')).toHaveLength(1)
    expect($tool.find('.eruda-log')).toHaveLength(2)
  })

  it('groupCollapsed', function() {
    tool.groupCollapsed('groupCollapsed')
    expect($tool.find('.eruda-groupCollapsed')).toHaveLength(1)
    expect($tool.find('.eruda-group-container.eruda-hidden')).toHaveLength(1)
    expect($tool.find('.eruda-icon-groupCollapsed')).toHaveLength(1)
    $tool.find('.eruda-groupCollapsed').click()
    expect($tool.find('.eruda-icon-group')).toHaveLength(1)
    expect($tool.find('.eruda-group-container.eruda-hidden')).toHaveLength(0)
    tool.log('test')
    expect($tool.find('.eruda-group-container').find('.eruda-log')).toContainText('test')
    tool.groupEnd()
    tool.log('test')
    expect($tool.find('.eruda-group-container').find('.eruda-log')).toHaveLength(1)
    expect($tool.find('.eruda-log')).toHaveLength(2)
  })


  describe('substitution', function() {
    it('number', function() {
      tool.log('Eruda is %d', 1.2, 'year old')
      expect($tool.find('.eruda-log')).toContainText('Eruda is 1 year old')

      tool.log('%i', 1.2, 'year old')
      expect($tool.find('.eruda-log')).toContainText('1 year old')

      tool.log('%f', 1.2, 'year old')
      expect($tool.find('.eruda-log')).toContainText('1.2 year old')
    })

    it('string', function() {
      tool.log('My name is %s', 'eruda')
      expect($tool.find('.eruda-log')).toContainText('My name is eruda')
    })

    it('object', function() {
      tool.log('Object is %O', { a: 1 })
      expect($tool.find('.eruda-log')).toContainText('Object is { a: 1 }')

      tool.log('Dom is %o', document.createElement('script'))
      expect($tool.find('.eruda-log')).toContainText('Dom is <script></script>')
    })

    it('style', function() {
      tool.log('%cblue%cgreen', 'color:blue', 'color:green')
      expect($tool.find('.eruda-log')).toContainHtml(
        '<span style="color:blue">blue</span><span style="color:green">green</span>'
      )
    })

    it('Repeat log', function() {
      for (let i = 0; i < 10; i++) tool.log(1)
      let $log = $tool.find('.eruda-log-item')
      expect($log).toHaveLength(1)
      expect($log.find('.eruda-count')).toContainText('10')
    })
  })

  describe('table', function() {
    it('wrong args', function() {
      tool.table('test')
      expect($tool.find('.eruda-table')).not.toContainElement('table')
    })

    it('sort keys', function() {
      tool.table([{ a: 1 }, { d: 2, a: 2 }, { c: 1 }])
      expect($tool.find('.eruda-table thead tr')).toContainHtml(
        '<th>(index)</th><th>a</th><th>c</th><th>d</th>'
      )
    })

    it('basic', function() {
      tool.table([{ test: 1 }, { test: 2, test2: 3 }])
      expect($tool.find('.eruda-table tbody tr')).toHaveLength(2)
      expect($tool.find('.eruda-table thead th')).toHaveLength(3)
    })

    it('filter', function() {
      tool.table([{ test: 1 }, { test: 2, test2: 3 }], 'test')
      expect($tool.find('.eruda-table thead th')).toHaveLength(2)
    })
  })

  describe('filter', function() {
    // Test case from https://github.com/liriliri/eruda/issues/14
    it('function', function() {
      tool.filter(function(log) {
        return log.type !== 'error'
      })

      let obj = {}
      Object.defineProperty(obj, 'a', {
        get: function() {
          tool.error('deprecated')

          return 1
        }
      })
      tool.log(obj)
      expect($tool.find('.eruda-logs li').length).toEqual(1)

      tool.filter('all')
    })

    it('all info error warn log', function() {
      tool
        .log('log')
        .info('info')
        .error('error')
        .warn('warn')
        .debug('debug')
      expect($tool.find('.eruda-log-item')).toHaveLength(5)

      tool.filter('info')
      expect($tool.find('.eruda-log-item')).toHaveLength(1)
      expect($tool.find('.eruda-info')).toHaveLength(1)

      tool.filter('error')
      expect($tool.find('.eruda-log-item')).toHaveLength(1)
      expect($tool.find('.eruda-error')).toHaveLength(1)

      tool.filter('warn')
      expect($tool.find('.eruda-log-item')).toHaveLength(1)
      expect($tool.find('.eruda-warn')).toHaveLength(1)

      tool.filter('debug')
      expect($tool.find('.eruda-log-item')).toHaveLength(1)
      expect($tool.find('.eruda-debug')).toHaveLength(1)

      tool.filter('all')
    })

    it('regex', function() {
      tool.log('test').log('test2')
      expect($tool.find('.eruda-log-item')).toHaveLength(2)

      tool.filter(/test2/)
      expect($tool.find('.eruda-log-item')).toHaveLength(1)
      expect($tool.find('.eruda-log')).toContainText('test2')

      tool.filter('all')
    })
  })

  describe('config', function() {
    let config = tool.config

    it('max number', function() {
      config.set('maxLogNum', '10')
      for (let i = 0; i < 20; i++) tool.log(i)
      expect($tool.find('.eruda-log-item')).toHaveLength(10)
    })

    it('override console', function() {
      config.set('overrideConsole', true)
      console.log('test')
      expect($tool.find('.eruda-log-item')).toContainText('test')
    })

    it('display extra info', function() {
      config.set('displayExtraInfo', true)
      tool.log('test')
      expect($tool.find('.eruda-logs li')).toContainElement('.eruda-header')
    })
  })

  describe('ui', function() {
    it('clear', function() {
      tool.log('test')
      $('.eruda-clear-console').click()
      expect($tool.find('.eruda-logs li')).toHaveLength(0)
    })

    it('filter', function() {
      tool.log('test')
      tool.warn('test')
      expect($tool.find('.eruda-logs li')).toHaveLength(2)
      $('.eruda-filter[data-filter="warn"]').click()
      expect($tool.find('.eruda-logs li')).toHaveLength(1)
      $('.eruda-filter[data-filter="all"]').click()
    })

    it('help', function() {
      $tool.find('.eruda-help').click()
      expect($tool.find('.eruda-html')).toHaveLength(1)
    })
  })

  describe('execute', function() {
    it('js', function() {
      $tool.find('textarea').val('1+2')
      $('.eruda-execute').click()
      expect($tool.find('.eruda-output')).toContainText('3')
    })

    it('filter', function() {
      tool.log('test')
      tool.log('eruda')
      expect($tool.find('.eruda-logs li')).toHaveLength(2)
      $tool.find('textarea').val('/eruda')
      $('.eruda-execute').click()
      expect($tool.find('.eruda-logs li')).toHaveLength(1)
    })
  })

  describe('events', function() {
    it('log', function() {
      let sum = 0
      function add(num) {
        sum += num
      }
      tool.on('log', add)
      tool.log(5)
      expect(sum).toBe(5)
      tool.log(6)
      expect(sum).toBe(11)
      tool.off('log', add)
      tool.log(1)
      expect(sum).toBe(11)
    })
  })
})
