import each from 'licia/each'
import isStr from 'licia/isStr'
import startWith from 'licia/startWith'
import truncate from 'licia/truncate'
import LunaModal from 'luna-modal'
import LunaDataGrid from 'luna-data-grid'
import isNull from 'licia/isNull'
import trim from 'licia/trim'
import copy from 'licia/copy'
import emitter from '../lib/emitter'
import { safeStorage, classPrefix as c } from '../lib/util'

export default class Storage {
  constructor($container, devtools, resources, type) {
    this._type = type
    this._$container = $container
    this._devtools = devtools
    this._resources = resources
    this._selectedItem = null
    this._storeData = []

    this._initTpl()
    this._dataGrid = new LunaDataGrid(this._$dataGrid.get(0), {
      columns: [
        {
          id: 'key',
          title: 'Key',
          weight: 30,
        },
        {
          id: 'value',
          title: 'Value',
          weight: 90,
        },
      ],
      minHeight: 60,
      maxHeight: 223,
    })

    this._bindEvent()
  }
  destroy() {
    emitter.off(emitter.SCALE, this._updateGridHeight)
  }
  refresh() {
    const dataGrid = this._dataGrid

    this._refreshStorage()
    dataGrid.clear()

    each(this._storeData, ({ key, val }) => {
      dataGrid.append(
        {
          key,
          value: val,
        },
        {
          selectable: true,
        }
      )
    })
  }
  _refreshStorage() {
    const resources = this._resources

    let store = safeStorage(this._type, false)

    if (!store) return

    const storeData = []

    // Mobile safari is not able to loop through localStorage directly.
    store = JSON.parse(JSON.stringify(store))

    each(store, (val, key) => {
      // According to issue 20, not all values are guaranteed to be string.
      if (!isStr(val)) return

      if (resources.config.get('hideErudaSetting')) {
        if (startWith(key, 'eruda') || key === 'active-eruda') return
      }

      storeData.push({
        key: key,
        val: truncate(val, 200),
      })
    })

    this._storeData = storeData
  }
  _updateButtons() {
    const $container = this._$container
    const $showDetail = $container.find(c('.show-detail'))
    const $deleteStorage = $container.find(c('.delete-storage'))
    const $copyStorage = $container.find(c('.copy-storage'))
    const btnDisabled = c('btn-disabled')

    $showDetail.addClass(btnDisabled)
    $deleteStorage.addClass(btnDisabled)
    $copyStorage.addClass(btnDisabled)

    if (this._selectedItem) {
      $showDetail.rmClass(btnDisabled)
      $deleteStorage.rmClass(btnDisabled)
      $copyStorage.rmClass(btnDisabled)
    }
  }
  _initTpl() {
    const $container = this._$container
    const type = this._type

    $container.html(
      c(`<h2 class="title">
      ${type === 'local' ? 'Local' : 'Session'} Storage
      <div class="btn refresh-storage">
        <span class="icon icon-refresh"></span>
      </div>
      <div class="btn show-detail btn-disabled">
        <span class="icon icon-eye"></span>
      </div>
      <div class="btn copy-storage btn-disabled">
        <span class="icon icon-copy"></span>
      </div>
      <div class="btn delete-storage btn-disabled">
        <span class="icon icon-delete"></span>
      </div>
      <div class="btn clear-storage">
        <span class="icon icon-clear"></span>
      </div>
      <div class="btn filter">
        <span class="icon icon-filter"></span>
      </div>
      <div class="btn filter-text"></div>
    </h2>
    <div class="data-grid"></div>`)
    )

    this._$dataGrid = $container.find(c('.data-grid'))
    this._$filterText = $container.find(c('.filter-text'))
  }
  _getVal(key) {
    return this._type === 'local'
      ? localStorage.getItem(key)
      : sessionStorage.getItem(key)
  }
  _updateGridHeight = (scale) => {
    this._dataGrid.setOption({
      minHeight: 60 * scale,
      maxHeight: 223 * scale,
    })
  }
  _bindEvent() {
    const type = this._type
    const devtools = this._devtools

    this._$container
      .on('click', c('.refresh-storage'), () => {
        devtools.notify('Refreshed', { icon: 'success' })
        this.refresh()
      })
      .on('click', c('.clear-storage'), () => {
        each(this._storeData, (val) => {
          if (type === 'local') {
            localStorage.removeItem(val.key)
          } else {
            sessionStorage.removeItem(val.key)
          }
        })
        this.refresh()
      })
      .on('click', c('.show-detail'), () => {
        const key = this._selectedItem
        const val = this._getVal(key)

        try {
          showSources('object', JSON.parse(val))
        } catch {
          showSources('raw', val)
        }
      })
      .on('click', c('.copy-storage'), () => {
        const key = this._selectedItem
        copy(this._getVal(key))
        devtools.notify('Copied', { icon: 'success' })
      })
      .on('click', c('.filter'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          this._$filterText.text(filter)
          this._dataGrid.setOption('filter', filter)
        })
      })
      .on('click', c('.delete-storage'), () => {
        const key = this._selectedItem

        if (type === 'local') {
          localStorage.removeItem(key)
        } else {
          sessionStorage.removeItem(key)
        }

        this.refresh()
      })

    function showSources(type, data) {
      const sources = devtools.get('sources')
      if (!sources) return

      sources.set(type, data)

      devtools.showTool('sources')

      return true
    }

    this._dataGrid
      .on('select', (node) => {
        this._selectedItem = node.data.key
        this._updateButtons()
      })
      .on('deselect', () => {
        this._selectedItem = null
        this._updateButtons()
      })

    emitter.on(emitter.SCALE, this._updateGridHeight)
  }
}
