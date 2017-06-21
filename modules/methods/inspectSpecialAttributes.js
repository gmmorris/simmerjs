/**
 * Inspect the elements' special attributes which are likely to be unique to the element
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (
  hierarchy,
  state,
  config,
  validateSelector,
  query,
  onError
) {
  let elm = hierarchy[0]
  let tag = elm.el.nodeName
  let attribute

  switch (tag) {
    case 'A':
      attribute = elm.el.getAttribute('href')
      if (attribute) {
        state.stack[0].push('A[href="' + attribute + '"]')
        state.specificity += 10
      }
      break
    case 'IMG':
      attribute = elm.el.getAttribute('src')
      if (attribute) {
        state.stack[0].push('IMG[src="' + attribute + '"]')
        state.specificity += 10
      }
      break
    default:
      // nothing to do here
      return state
  }

  if (
    validateSelector(
      hierarchy[0],
      state,
      config.selectorMaxLength,
      query,
      onError
    )
  ) {
    // the unique attribute worked!
    state.verified = true
  } else {
    // turns out our so called unique attribute isn't as unique as we thought,
    // we'll remove it to keep the selector's noise level down
    state.stack[0].pop()
  }

  return state
}
