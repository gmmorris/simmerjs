/**
   * Conver the Selector State into a merged CSS selector
   * @param state (object) The current selector state (has the stack and specificity sum)
   * @param depth (int) The number of levels to merge (1..state.stack.length)
   */
export default function (state, depth) {
  depth = depth || state.stack.length

  let selectorSegments = []
  let rejectableLayers = 0
  let index

  // cycle through the layers from the top down to the analyzed element
  for (index = depth - 1; index >= 0; index -= 1) {
    if (state.stack[index].length === 0) {
      // if no details were obtainable on this element, and this is not the 'top' layer (which we simply ignore),
      // place the 'all' placeholder in there for the selector
      if (index !== depth - 1 - rejectableLayers) {
        selectorSegments.push('*')
      } else {
        // count how many ancestors layers have been rejected
        // so we can ignore them later
        rejectableLayers += 1
      }
    } else {
      selectorSegments.push(state.stack[index].join(''))
    }
  }

  // join as a hierarchy selector, in reverse order from top to bottom
  return selectorSegments.join(' > ')
}
