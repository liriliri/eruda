describe('devTools', function () {
  describe('init', function () {
    it('destroy', function () {
      eruda.destroy()

      expect($('#eruda')).toHaveLength(0)
    })

    it('init', function () {
      let container = document.createElement('div')
      container.id = 'eruda'
      document.body.appendChild(container)

      eruda.init({
        container: container,
        tool: [],
        useShadowDom: false,
      })

      let $eruda = $('#eruda')
      expect($eruda.find('.eruda-dev-tools')).toHaveLength(1)
    })
  })

  describe('tool', function () {
    it('add', function () {
      eruda.add({
        name: 'test',
        init: function ($el) {
          this._$el = $el
          $el.html('Test Plugin')
        },
      })

      expect($('.eruda-test')).toContainText('Test Plugin')
    })

    it('show', function () {
      let $tool = $('.eruda-test')
      expect($tool).toBeHidden()
      eruda.show('test')
      expect($tool).toHaveCss({ display: 'block' })
    })

    it('remove', function () {
      eruda.remove('test')
      expect($('.eruda-test')).toHaveLength(0)
    })
  })

  describe('display', function () {
    it('show', function () {
      eruda.show()
      expect($('.eruda-dev-tools')).toHaveCss({ display: 'block' })
    })

    it('hide', function (done) {
      eruda.hide()
      setTimeout(function () {
        expect($('.eruda-dev-tools')).toBeHidden()
        done()
      }, 500)
    })
  })

  describe('scale', function () {
    it('get', function () {
      eruda.scale(1)
      expect(eruda.scale()).toBe(1)
    })
  })
})

describe('EntryBtn', function () {
  describe('hideEntry', function () {
    it('destroy', function () {
      eruda.destroy()

      expect($('#eruda')).toHaveLength(0)
    })

    it('hideEntry', function () {
      let container = document.createElement('div')
      container.id = 'eruda'
      document.body.appendChild(container)

      eruda.init({
        container: container,
        tool: [],
        useShadowDom: false,
        hideEntry: true
      })

      let $eruda = $('#eruda')
      expect($eruda.find('.eruda-entry-btn').css('display')).toBe('none')
    })
  })
})
