import each from 'licia/each'
import LunaModal from 'luna-modal'
import LunaDataGrid from 'luna-data-grid'
import isNull from 'licia/isNull'
import trim from 'licia/trim'
import emitter from '../lib/emitter'
import { classPrefix as c } from '../lib/util'
import { deleteDB, openDB } from 'idb'

export default class IndexedDB {
  constructor($container, devtools) {
    this._$container = $container
    this._devtools = devtools
    this._selectedItem = null
    this._storeData = []
    this._supported = true

    this._initTpl()
    this._dataGrid = new LunaDataGrid(this._$dataGrid.get(0), {
      columns: [
        {
          id: 'database',
          title: 'Database',
          weight: 30,
        },
        {
          id: 'store',
          title: 'Store',
          weight: 60,
        },
        {
          id: 'objects',
          title: 'Objects',
          weight: 20,
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
  async refresh() {
    if (!this._supported) {
        this._$container.hide()

        return
    }

    const dataGrid = this._dataGrid

    await this._refreshData()

    dataGrid.clear()

    each(this._storeData, ({ database, store, objects }) => {
      dataGrid.append(
        {
          database, store, objects
        },
        {
          selectable: true,
        }
      )
    })
  }
  async _refreshData() {
    try {
        const databases = await indexedDB.databases()
        const values = await Promise.all(databases.map(async database => {
            const db = await openDB(database.name)
            const values = await Promise.all(Array.from(db.objectStoreNames).map(async store => {
                return {
                    database: database.name,
                    store,
                    objects: await db.count(store),
                }
            }))

            db.close()

            return values
        }))

        this._storeData = values.flat()
    } catch {
        this._supported = false
        this._$container.hide()
    }
  }
  _updateButtons() {
    const $container = this._$container
    const $showDetail = $container.find(c('.show-detail'))
    const btnDisabled = c('btn-disabled')

    $showDetail.addClass(btnDisabled)

    if (this._selectedItem) {
      $showDetail.rmClass(btnDisabled)
    }
  }
  _initTpl() {
    const $container = this._$container

    $container.html(
      c(`<h2 class="title">
      IndexedDB
      <div class="btn refresh-databases">
        <span class="icon icon-refresh"></span>
      </div>
      <div class="btn show-detail btn-disabled">
        <span class="icon icon-eye"></span>
      </div>
      <div class="btn clear-databases">
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
  async _getVal(database, store) {
    const db = await openDB(database)
    const objects = await db.getAll(store)

    db.close()

    return objects
  }
  _updateGridHeight = (scale) => {
    this._dataGrid.setOption({
      minHeight: 60 * scale,
      maxHeight: 223 * scale,
    })
  }
  _bindEvent() {
    const devtools = this._devtools

    this._$container
      .on('click', c('.refresh-databases'), () => {
        devtools.notify('Refreshed', { icon: 'success' })
        this.refresh()
      })
      .on('click', c('.clear-databases'), async () => {
        const databases = new Set(this._storeData.map(({ database }) => database))

        await Promise.all(Array.from(databases).map(database => deleteDB(database)))

        this.refresh()
      })
      .on('click', c('.show-detail'), async () => {
        const { database, store } = this._selectedItem
        const val = await this._getVal(database, store)

        try {
          showSources('object', JSON.parse(JSON.stringify(val)))
        } catch {
          showSources('raw', val)
        }
      })
      .on('click', c('.filter'), () => {
        LunaModal.prompt('Filter').then((filter) => {
          if (isNull(filter)) return
          filter = trim(filter)
          this._$filterText.text(filter)
          this._dataGrid.setOption('filter', filter)
        })
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
        this._selectedItem = {
            database: node.data.database,
            store: node.data.store,
        }
        this._updateButtons()
      })
      .on('deselect', () => {
        this._selectedItem = null
        this._updateButtons()
      })

    emitter.on(emitter.SCALE, this._updateGridHeight)
  }
}
