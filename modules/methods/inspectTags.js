import { tagName } from './validationHelpers'

/**
/**
 * Inspect the elements' Tag names and add them to the calculates CSS selector
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state) {
  return hierarchy.reduce((selectorState, currentElem, index) => {
    ;[currentElem.el.nodeName].filter(tagName).forEach(tagName => {
      selectorState.stack[index].splice(0, 0, tagName)
      selectorState.specificity += 10
    })
    return selectorState
  }, state)
}
