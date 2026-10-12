import Tool from '../DevTools/Tool'
import LunaDataGrid from 'luna-data-grid'
import $ from 'licia/$'
import each from 'licia/each'
import chobitsu from '../lib/chobitsu'
import evalCss from '../lib/evalCss'
import { classPrefix as c } from '../lib/util'

const storageTypes = [
  { id: 'cookies', title: 'Cookies' },
  { id: 'local', title: 'Local Storage' },
  { id: 'session', title: 'Session Storage' },
  { id: 'indexedDB', title: 'IndexedDB' },
  { id: 'cache', title: 'Cache Storage' },
]

export default class Storage extends Tool {
  constructor() {
    super()

    this.name = 'storage'
    this._style = evalCss(require('./Storage.scss'))
    this._view = { type: 'cookies' }
    this._rows = []
    this._selectedRow = null
  }
  init($el, devtools) {
    super.init($el)
    this._devtools = devtools

    this._initTpl()
    this._dataGrid = new LunaDataGrid(this._$dataGrid.get(0), {
      columns: [
        { id: 'key', title: 'Key', weight: 40 },
        { id: 'value', title: 'Value', weight: 80 },
      ],
      minHeight: 60,
      maxHeight: 400,
    })
    this._bindEvent()
    this.refresh()
  }
  destroy() {
    if (this._dataGrid) this._dataGrid.destroy()
    super.destroy()
    evalCss.remove(this._style)
  }
  show() {
    super.show()
    this.refresh()

    return this
  }
  refresh() {
    this._closeEditor()
    this._setTitle()
    this._dataGrid.clear()
    this._rows = []

    const view = this._view
    if (view.type === 'cookies') return this._refreshCookies()
    if (view.type === 'local' || view.type === 'session') {
      return this._refreshWebStorage(view.type)
    }
    if (view.type === 'indexedDB') return this._refreshIndexedDB(view)
    if (view.type === 'cache') return this._refreshCache(view)

    return this
  }
  _initTpl() {
    const root = createElement('div', 'storage')
    const tree = createElement('nav', 'storage-tree')
    const content = createElement('section', 'storage-content')
    const title = createElement('h2', 'storage-title')
    const path = createElement('span', 'storage-path')
    const back = createButton('storage-back hidden', 'icon-left')
    const refresh = createButton('storage-refresh', 'icon-refresh')
    const edit = createElement('div', 'btn storage-edit btn-disabled')
    const clear = createButton('storage-clear', 'icon-clear')
    const editor = createElement('div', 'storage-editor hidden')
    const keyLabel = createElement('label', 'storage-editor-key-label')
    const keyInput = createElement('input', 'storage-editor-key')
    const valueLabel = createElement('label')
    const valueInput = createElement('textarea', 'storage-editor-value')
    const actions = createElement('div', 'storage-editor-actions')
    const save = createElement('button', 'storage-save')
    const cancel = createElement('button', 'storage-cancel')
    const grid = createElement('div', 'storage-grid')

    edit.textContent = 'Edit'
    keyLabel.appendChild(document.createTextNode('Name'))
    keyInput.type = 'text'
    keyInput.autocomplete = 'off'
    keyLabel.appendChild(keyInput)
    valueLabel.appendChild(document.createTextNode('Data'))
    valueInput.rows = 3
    valueInput.spellcheck = false
    valueLabel.appendChild(valueInput)
    save.textContent = 'Save'
    cancel.textContent = 'Cancel'
    actions.appendChild(save)
    actions.appendChild(cancel)
    editor.appendChild(keyLabel)
    editor.appendChild(valueLabel)
    editor.appendChild(actions)
    title.appendChild(path)
    title.appendChild(back)
    title.appendChild(refresh)
    title.appendChild(edit)
    title.appendChild(clear)
    content.appendChild(title)
    content.appendChild(editor)
    content.appendChild(grid)
    root.appendChild(tree)
    root.appendChild(content)

    const toolEl = this._$el.get(0)
    toolEl.textContent = ''
    toolEl.appendChild(root)
    this._$tree = $(tree)
    this._$path = $(path)
    this._$back = $(back)
    this._$editor = $(editor)
    this._$dataGrid = $(grid)

    storageTypes.forEach((type) => {
      const item = createElement('button', 'storage-tree-item')
      item.dataset.type = type.id
      item.textContent = type.title
      tree.appendChild(item)
    })
  }
  _bindEvent() {
    this._$tree.on('click', c('.storage-tree-item'), function (e) {
      const type = e.curTarget.getAttribute('data-type')
      this._view = { type }
      this.refresh()
    }.bind(this))
    this._$el
      .on('click', c('.storage-refresh'), () => this.refresh())
      .on('click', c('.storage-back'), () => {
        const view = this._view
        if (view.store) {
          delete view.store
        } else if (view.database || view.cacheName) {
          delete view.database
          delete view.cacheName
        }
        this.refresh()
      })
      .on('click', c('.storage-clear'), () => this._clear())
      .on('click', c('.storage-edit'), () => this._editSelected())
      .on('click', c('.storage-save'), () => this._saveEdit())
      .on('click', c('.storage-cancel'), () => this._closeEditor())

    this._$editor.get(0).addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this._closeEditor()
      } else if (
        event.key === 'Enter' &&
        (event.target.className === c('storage-editor-key') ||
          (event.target.className === c('storage-editor-value') &&
            (event.ctrlKey || event.metaKey)))
      ) {
        event.preventDefault()
        this._saveEdit()
      }
    })

    this._dataGrid.on('select', (node) => {
      const row = this._rows[node.data.index]
      if (!row) return
      this._selectedRow = row
      this._updateEditButton()
      if (row.open) {
        this._view = row.open
        this.refresh()
        return
      }
      if (row.request) {
        window.caches
          .open(this._view.cacheName)
          .then((cache) => cache.match(row.request))
          .then((response) => (response ? response.text() : ''))
          .then((source) => this._showSource(source))
          .catch((err) => this._showError(err))
        return
      }
    })
    this._dataGrid.on('dblclick', (event, node) => {
      this._beginEdit(this._rows[node.data.index])
    })
    this._dataGrid.on('deselect', () => {
      this._selectedRow = null
      this._updateEditButton()
    })
  }
  _setTitle() {
    const view = this._view
    let title =
      storageTypes.filter((type) => type.id === view.type)[0].title
    if (view.database) title += ` / ${view.database}`
    if (view.cacheName) title += ` / ${view.cacheName}`
    if (view.store) title += ` / ${view.store}`
    this._$path.text(title)
    if (view.store || view.database || view.cacheName) {
      this._$back.rmClass(c('hidden'))
    } else {
      this._$back.addClass(c('hidden'))
    }
    this._$tree.find(c('.storage-tree-item')).rmClass(c('selected'))
    this._$tree
      .find(`${c('.storage-tree-item')}[data-type="${view.type}"]`)
      .addClass(c('selected'))
  }
  _renderRows(rows) {
    this._closeEditor()
    this._rows = rows
    this._selectedRow = null
    this._updateEditButton()
    this._dataGrid.clear()
    each(rows, (row, index) => {
      this._dataGrid.append(
        { key: row.key, value: row.value, index },
        { selectable: true }
      )
    })
  }
  _refreshCookies() {
    try {
      const cookies = chobitsu.domain('Network').getCookies().cookies
      this._renderRows(
        cookies.map((cookie) => ({
          key: cookie.name,
          value: cookie.value,
          source: stringify(cookie),
          cookie,
          editable: true,
        }))
      )
    } catch (err) {
      this._showError(err)
    }

    return this
  }
  _refreshWebStorage(type) {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      const rows = []
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        rows.push({
          key,
          value: storage.getItem(key),
          source: storage.getItem(key),
          editable: true,
        })
      }
      this._renderRows(rows)
    } catch (err) {
      this._showError(err)
    }

    return this
  }
  _refreshIndexedDB(view) {
    if (!window.indexedDB || !window.indexedDB.databases) {
      this._showError(new Error('Listing IndexedDB databases is not supported'))
      return this
    }

    let databases
    try {
      databases = window.indexedDB.databases()
    } catch (err) {
      this._showError(err)
      return this
    }
    databases
      .then((databases) => {
        if (this._view !== view) return
        if (!view.database) {
          this._renderRows(
            databases.map((database) => ({
              key: database.name,
              value: `Version ${database.version}`,
              open: { type: 'indexedDB', database: database.name },
            }))
          )
          return
        }
        this._openDatabase(view.database, (db) => {
          if (this._view !== view) {
            db.close()
            return
          }
          if (!view.store) {
            const rows = []
            const stores = []
            for (let i = 0; i < db.objectStoreNames.length; i++) {
              stores.push(db.objectStoreNames[i])
            }
            each(stores, (name) => {
              const request = db.transaction(name).objectStore(name).count()
              request.onsuccess = () => {
                rows.push({
                  key: name,
                  value: `${request.result} records`,
                  open: {
                    type: 'indexedDB',
                    database: view.database,
                    store: name,
                  },
                })
                if (rows.length === db.objectStoreNames.length) {
                  db.close()
                  if (this._view === view) this._renderRows(rows)
                }
              }
              request.onerror = () => {
                db.close()
                this._showError(request.error)
              }
            })
            if (stores.length === 0) {
              db.close()
              this._renderRows([])
            }
            return
          }

          const transaction = db.transaction(view.store, 'readonly')
          const request = transaction.objectStore(view.store).openCursor()
          const rows = []
          request.onsuccess = () => {
            const cursor = request.result
            if (cursor) {
              const source = stringify(cursor.value)
              rows.push({
                key: stringify(cursor.key),
                value: source,
                source,
                editable: true,
                recordKey: cursor.key,
                recordValue: cursor.value,
                keyPath: transaction.objectStore(view.store).keyPath,
              })
              cursor.continue()
            } else {
              db.close()
              if (this._view === view) this._renderRows(rows)
            }
          }
          request.onerror = () => {
            db.close()
            this._showError(request.error)
          }
        })
      })
      .catch((err) => this._showError(err))

    return this
  }
  _openDatabase(name, callback) {
    let request
    try {
      request = window.indexedDB.open(name)
    } catch (err) {
      this._showError(err)
      return
    }
    request.onsuccess = () => callback(request.result)
    request.onerror = () => this._showError(request.error)
    request.onupgradeneeded = () => {
      request.transaction.abort()
      this._showError(
        new Error('The selected IndexedDB database is no longer available')
      )
    }
  }
  _refreshCache(view) {
    if (!window.caches) {
      this._showError(new Error('Cache Storage is not supported'))
      return this
    }

    let cacheNames
    try {
      cacheNames = window.caches.keys()
    } catch (err) {
      this._showError(err)
      return this
    }
    cacheNames
      .then((names) => {
        if (this._view !== view) return
        if (!view.cacheName) {
          this._renderRows(
            names.map((name) => ({
              key: name,
              value: 'Cache',
              open: { type: 'cache', cacheName: name },
            }))
          )
          return
        }
        return window.caches.open(view.cacheName).then((cache) =>
          cache.keys().then((requests) => {
            if (this._view !== view) return
            this._renderRows(
              requests.map((request) => ({
                key: request.url,
                value: request.method,
                request,
              }))
            )
          })
        )
      })
      .catch((err) => this._showError(err))

    return this
  }
  _clear() {
    const view = this._view
    let action

    try {
      if (view.type === 'local') {
        localStorage.clear()
      } else if (view.type === 'session') {
        sessionStorage.clear()
      } else if (view.type === 'cookies') {
        chobitsu.domain('Storage').clearDataForOrigin({
          storageTypes: 'cookies',
        })
      } else if (view.type === 'indexedDB') {
        if (view.store) {
          this._clearObjectStore(view)
          return
        }
        action = view.database
          ? [view.database]
          : window.indexedDB.databases().then((databases) =>
              databases.map((database) => database.name)
            )
        Promise.resolve(action)
          .then((names) =>
            Promise.all(names.map((name) => deleteDatabase(name)))
          )
          .then(() => this.refresh())
          .catch((err) => this._showError(err))
        return
      } else if (view.type === 'cache') {
        action = view.cacheName
          ? Promise.resolve([view.cacheName])
          : window.caches.keys()
        Promise.resolve(action)
          .then((names) =>
            Promise.all(names.map((name) => window.caches.delete(name)))
          )
          .then(() => this.refresh())
          .catch((err) => this._showError(err))
        return
      }
      this.refresh()
    } catch (err) {
      this._showError(err)
    }
  }
  _clearObjectStore(view) {
    this._openDatabase(view.database, (db) => {
      let request
      try {
        request = db
          .transaction(view.store, 'readwrite')
          .objectStore(view.store)
          .clear()
      } catch (err) {
        db.close()
        this._showError(err)
        return
      }
      request.onsuccess = () => {
        db.close()
        if (this._view === view) this.refresh()
      }
      request.onerror = () => {
        db.close()
        this._showError(request.error)
      }
    })
  }
  _updateEditButton() {
    const $button = this._$el.find(c('.storage-edit'))
    if (this._selectedRow && this._selectedRow.editable) {
      $button.rmClass(c('btn-disabled'))
    } else {
      $button.addClass(c('btn-disabled'))
    }
  }
  _editSelected() {
    this._beginEdit(this._selectedRow)
  }
  _beginEdit(row) {
    if (!row || !row.editable) return
    this._selectedRow = row
    const keyInput = this._$editor.find(c('.storage-editor-key')).get(0)
    const valueInput = this._$editor.find(c('.storage-editor-value')).get(0)
    const keyLabel = this._$editor.find(c('.storage-editor-key-label'))
    keyInput.value = row.key
    valueInput.value = row.value
    if (this._view.type === 'indexedDB' && row.keyPath !== null) {
      keyLabel.addClass(c('hidden'))
    } else {
      keyLabel.rmClass(c('hidden'))
    }
    this._$editor.rmClass(c('hidden'))
    if (this._view.type === 'indexedDB' && row.keyPath !== null) {
      valueInput.focus()
    } else {
      keyInput.focus()
      keyInput.select()
    }
  }
  _closeEditor() {
    if (this._$editor) this._$editor.addClass(c('hidden'))
  }
  _saveEdit() {
    const row = this._selectedRow
    if (!row || !row.editable) return
    const key = this._$editor.find(c('.storage-editor-key')).get(0).value
    const value = this._$editor.find(c('.storage-editor-value')).get(0).value
    const view = this._view

    try {
      if (view.type === 'local' || view.type === 'session') {
        const storage = view.type === 'local' ? localStorage : sessionStorage
        storage.setItem(key, value)
        if (key !== row.key) storage.removeItem(row.key)
      } else if (view.type === 'cookies') {
        if (!key || /[;=]/.test(key)) {
          throw new Error('Cookie names cannot be empty or contain ; or =')
        }
        document.cookie = `${key}=${encodeURIComponent(value)}`
        const cookies = chobitsu.domain('Network').getCookies().cookies
        const updated = cookies.filter((cookie) => cookie.name === key)[0]
        if (!updated || updated.value !== value) {
          throw new Error('The cookie could not be updated')
        }
        if (key !== row.key) {
          chobitsu.domain('Network').deleteCookies({ name: row.key })
        }
      } else if (view.type === 'indexedDB') {
        this._updateIndexedDBRecord(view, row, key, value)
        return
      }
      this._closeEditor()
      this.refresh()
    } catch (err) {
      this._showError(err)
    }
  }
  _updateIndexedDBRecord(view, row, key, value) {
    let nextValue
    let nextKey
    try {
      nextValue = parseJsonInput(value)
      nextKey = row.keyPath === null ? parseJsonInput(key) : row.recordKey
    } catch (err) {
      this._showError(err)
      return
    }
    this._openDatabase(view.database, (db) => {
      let transaction
      try {
        transaction = db.transaction(view.store, 'readwrite')
        const store = transaction.objectStore(view.store)
        if (row.keyPath === null && nextKey !== row.recordKey) {
          store.delete(row.recordKey)
          store.put(nextValue, nextKey)
        } else {
          store.put(nextValue)
        }
      } catch (err) {
        db.close()
        this._showError(err)
        return
      }
      transaction.oncomplete = () => {
        db.close()
        if (this._view === view) {
          this._closeEditor()
          this.refresh()
        }
      }
      transaction.onerror = () => {
        db.close()
        this._showError(transaction.error)
      }
      transaction.onabort = () => {
        db.close()
        this._showError(transaction.error || new Error('IndexedDB edit aborted'))
      }
    })
  }
  _showSource(data) {
    const sources = this._devtools.get('sources')
    if (!sources) return
    sources.set('raw', data)
    this._devtools.showTool('sources')
  }
  _showError(err) {
    const message = err && err.message ? err.message : String(err)
    this._devtools.notify(`Storage error: ${message}`, { icon: 'error' })
  }
}

function parseJsonInput(value) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function createElement(tagName, className) {
  const el = document.createElement(tagName)
  if (className) el.className = c(className)
  return el
}

function createButton(className, icon) {
  const button = createElement('div', `btn ${className}`)
  const iconEl = createElement('span', icon)
  button.appendChild(iconEl)

  return button
}

function stringify(value) {
  try {
    const result = JSON.stringify(value)
    return result === undefined ? String(value) : result
  } catch {
    return String(value)
  }
}

function deleteDatabase(name) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase(name)
    request.onsuccess = resolve
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error(`Deleting "${name}" was blocked`))
  })
}
