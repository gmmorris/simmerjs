import takeRight from 'lodash.takeright'
/**
   * Conver the Selector State into a merged CSS selector
   * @param state (object) The current selector state (has the stack and specificity sum)
   * @param depth (int) The number of levels to merge (1..state.stack.length)
   */
export default function (state, depth = state.stack.length) {
  return (
    takeRight(
      state.stack.reduceRight((selectorSegments, elementState) => {
        if (elementState.length) {
          selectorSegments.push(elementState.join(''))
        } else if (selectorSegments.length) {
          selectorSegments.push('*')
        }
        return selectorSegments
      }, []),
      depth
    ).join(' > ') || '*'
  )
}
