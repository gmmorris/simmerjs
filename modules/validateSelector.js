import convertSelectorStateIntoCSSSelector from './convertSelectorStateIntoCSSSelector'
/**
   * Execute a query using the current selector state and see if it produces a unique result.
   * If the result is unique then the analysis is complete and we can finish the process.
   * @param {object} element. The element we are trying to build a selector for
   * @param {object} state. The current selector state (has the stack and specificity sum)
   */
export default function (element, config, query, onError) {
  const { selectorMaxLength } = config
  return function (state) {
    let validated = false
    let selector
    let results
    for (let depth = 1; depth <= state.stack.length && !validated; depth += 1) {
      // use selector to query an element and see if it is a one-to-one selection

      selector = convertSelectorStateIntoCSSSelector(state, depth).trim()

      if (!(selector && selector.length)) {
        // too short
        return false
      }
      if (selectorMaxLength && selector.length > selectorMaxLength) {
        // the selector is too long
        return false
      }
      results = query(selector, onError)
      validated =
        results.length === 1 &&
        (element.el !== undefined
          ? results[0] === element.el
          : results[0] === element)

      // we have to mark how deep the valdiation passed at
      if (validated) {
        state.verificationDepth = depth
      }
    }

    return validated
  }
}
