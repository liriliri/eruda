import LunaDataGrid from 'luna-data-grid'
import isOdd from 'licia/isOdd'
import throttle from 'licia/throttle'
import { pxToNum } from '../lib/util'

export const NETWORK_ROW_HEIGHT = 32

/**
 * LunaDataGrid currently fixes its virtual row height at 20px. Network needs a
 * larger touch target, so this adapter keeps the rendered row height and both
 * virtual-scroll calculations on the same value.
 */
export default class NetworkDataGrid extends LunaDataGrid {
  constructor(container, options) {
    super(container, options)

    this.renderData = throttle(
      ({ topTolerance = 500, bottomTolerance = 500 } = {}) => {
        if (this.sortId && !this.sorted) {
          this.sortNodes(this.sortId, this.isAscending)
        }

        const { dataContainer, displayNodes, tableBody } = this
        const { scrollTop, clientHeight } = dataContainer
        const top = scrollTop - topTolerance
        const bottom = scrollTop + clientHeight + bottomTolerance
        let topSpaceHeight = 0
        let currentHeight = 0
        const renderNodes = []

        for (let i = 0, len = displayNodes.length; i < len; i++) {
          const node = displayNodes[i]
          if (currentHeight <= bottom) {
            if (currentHeight + NETWORK_ROW_HEIGHT > top) {
              if (renderNodes.length === 0 && isOdd(i)) {
                renderNodes.push(displayNodes[i - 1])
                topSpaceHeight -= NETWORK_ROW_HEIGHT
              }
              renderNodes.push(node)
            } else if (currentHeight < top) {
              topSpaceHeight += NETWORK_ROW_HEIGHT
            }
          }
          currentHeight += NETWORK_ROW_HEIGHT
        }

        this.updateSpace(currentHeight)
        this.updateTopSpace(topSpaceHeight)

        const fragment = document.createDocumentFragment()
        for (let i = 0, len = renderNodes.length; i < len; i++) {
          fragment.appendChild(renderNodes[i].container)
        }
        fragment.appendChild(this.fillerRow)
        tableBody.textContent = ''
        tableBody.appendChild(fragment)
      },
      16,
    )

    /** Replace the initial render created with LunaDataGrid's default height. */
    this.renderData()
    this.updateHeight()
  }
  updateHeight() {
    const { $fillerRow, $container } = this
    let { maxHeight, minHeight } = this.options
    const headerHeight = this.$headerRow.offset().height
    const borderTopWidth = pxToNum($container.css('border-top-width'))
    const borderBottomWidth = pxToNum($container.css('border-bottom-width'))
    const minusHeight = headerHeight + borderTopWidth + borderBottomWidth

    minHeight = Math.max(0, minHeight - minusHeight)
    maxHeight -= minusHeight

    let height = NETWORK_ROW_HEIGHT * this.displayNodes.length
    if (height > minHeight) {
      $fillerRow.hide()
    } else {
      $fillerRow.show()
    }

    if (height < minHeight) {
      height = minHeight
    } else if (height >= maxHeight) {
      height = maxHeight
    }
    this.$dataContainer.css({ height })
  }
}
