describe('sources', function () {
  let tool = eruda.get('sources')
  let $tool = $('.eruda-sources')

  beforeEach(function () {
    eruda.show('sources')
  })

  it('raw', function () {
    tool.set('raw', '/* test */')
  })

  describe('object search', function () {
    it('expands matching branches and keeps them expanded', function () {
      tool.set('object', {
        stable: {
          branch: {
            target: 'needle',
          },
          untouched: {
            target: 'ordinary-value',
          },
        },
      })

      $('.eruda-source-search-input').val('needle')
      tool._applyObjectSearch()

      expect($('.eruda-source-search-match')).toHaveLength(1)
      expect($('.eruda-source-search-count').text()).toBe('1/1')
      expect(
        $('.eruda-json .luna-object-viewer-expanded').not(
          '.luna-object-viewer-collapsed',
        ),
      ).toHaveLength(2)
      expect(
        $('.eruda-json .luna-object-viewer-key').filter(function () {
          return $(this).text() === 'target'
        }),
      ).toHaveLength(1)

      $('.eruda-source-search-input').val('missing')
      tool._applyObjectSearch()

      expect(
        $('.eruda-json .luna-object-viewer-expanded').not(
          '.luna-object-viewer-collapsed',
        ),
      ).toHaveLength(2)
    })

    it('navigates between object matches', function () {
      tool.set('object', {
        first: 'needle',
        nested: {
          second: 'needle',
        },
      })

      $('.eruda-source-search-input').val('needle')
      tool._applyObjectSearch()

      const $matches = $('.eruda-source-search-match')
      expect($matches).toHaveLength(2)
      expect($('.eruda-source-search-count').text()).toBe('1/2')

      $('.eruda-source-search-next').click()
      expect($('.eruda-source-search-count').text()).toBe('2/2')
      expect($matches.eq(1)).toHaveClass('eruda-source-search-match-active')

      $('.eruda-source-search-prev').click()
      expect($('.eruda-source-search-count').text()).toBe('1/2')
      expect($matches.eq(0)).toHaveClass('eruda-source-search-match-active')
    })

    it('caps highlighted nodes for high-frequency matches', function () {
      tool.set('object', {
        values: Array.from({ length: 250 }, function (_, index) {
          return 'needle-' + index
        }),
      })

      $('.eruda-source-search-input').val('needle')
      tool._applyObjectSearch()

      expect($('.eruda-source-search-match')).toHaveLength(200)
      expect($('.eruda-source-search-count').text()).toBe('1/200+')
    })

    it('does not evaluate getters while finding matching branches', function () {
      let getterCalls = 0
      const branch = {}
      Object.defineProperty(branch, 'expensive', {
        enumerable: true,
        get() {
          getterCalls++
          return 'side-effect'
        },
      })
      branch.target = 'needle'

      tool.set('object', { branch })
      $('.eruda-source-search-input').val('needle')
      tool._applyObjectSearch()

      // One access is expected when Luna renders the branch after expansion.
      expect(getterCalls).toBe(1)
    })
  })
})
