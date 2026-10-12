describe('storage', function () {
  let $tool = $('#eruda-storage')

  beforeEach(function () {
    eruda.show('storage')
  })

  it('shows available storage types', function () {
    expect($tool.find('.eruda-storage-tree-item').length).toBe(5)
  })

  it('switches to local storage and clears it', function () {
    localStorage.setItem('storage-test-key', 'storage-test-value')

    $tool.find('.eruda-storage-tree-item[data-type="local"]').click()
    expect($tool.find('.eruda-storage-path').text()).toBe('Local Storage')

    $tool.find('.eruda-storage-clear').click()
    expect(localStorage.getItem('storage-test-key')).toBe(null)
  })

  it('edits a row on double click', function (done) {
    localStorage.setItem('storage-edit-key', 'old value')
    $tool.find('.eruda-storage-tree-item[data-type="local"]').click()
    setTimeout(function () {
      const $row = $tool
        .find('.eruda-storage-grid .luna-data-grid-node')
        .first()
      expect($row.length).toBe(1)
      if (!$row.length) return done()
      $row.get(0).dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

      expect(
        $tool.find('.eruda-storage-editor').hasClass('eruda-hidden')
      ).toBe(false)
      $tool.find('.eruda-storage-editor-key').val('storage-renamed-key')
      $tool.find('.eruda-storage-editor-value').val('new value')
      $tool.find('.eruda-storage-save').click()

      expect(localStorage.getItem('storage-renamed-key')).toBe('new value')
      expect(localStorage.getItem('storage-edit-key')).toBe(null)
      done()
    }, 50)
  })

  it('opens the editor with the touch-friendly edit button', function (done) {
    localStorage.setItem('storage-touch-key', 'touch value')
    $tool.find('.eruda-storage-tree-item[data-type="local"]').click()

    setTimeout(function () {
      const $row = $tool
        .find('.eruda-storage-grid .luna-data-grid-node')
        .first()
      expect($row.length).toBe(1)
      if (!$row.length) return done()
      $row.click()
      $tool.find('.eruda-storage-edit').click()

      expect(
        $tool.find('.eruda-storage-editor').hasClass('eruda-hidden')
      ).toBe(false)
      $tool.find('.eruda-storage-cancel').click()
      localStorage.removeItem('storage-touch-key')
      done()
    }, 50)
  })
})
