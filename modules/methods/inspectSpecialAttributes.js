const handlers = {
  A: (state, elm) => {
    const attribute = elm.el.getAttribute('href')
    if (attribute) {
      state.stack[0].push(`A[href="${attribute}"]`)
      state.specificity += 10
    }
    return state
  },
  IMG: (state, elm) => {
    const attribute = elm.el.getAttribute('src')
    if (attribute) {
      state.stack[0].push(`IMG[src="${attribute}"]`)
      state.specificity += 10
    }
    return state
  }
}

/**
 * Inspect the elements' special attributes which are likely to be unique to the element
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state, validateSelector) {
  const elm = hierarchy[0]
  const tag = elm.el.nodeName

  if (handlers[tag]) {
    state = handlers[tag](state, elm)
    if (validateSelector(state)) {
      // the unique attribute worked!
      state.verified = true
    } else {
      // turns out our so called unique attribute isn't as unique as we thought,
      // we'll remove it to keep the selector's noise level down
      state.stack[0].pop()
    }
  }
  return state
}
