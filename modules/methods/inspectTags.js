/**
 * Inspect the elements' Tag names and add them to the calculates CSS selector
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state) {
  var index, currentElem, currentTag
  for (index = 0; index < hierarchy.length; index += 1) {
    currentElem = hierarchy[index]
    currentTag = this.validationHelpers.tagName(currentElem.el.nodeName)

    if (currentTag) {
      state.stack[index].splice(0, 0, currentTag)
      state.specificity += 10
    }
  }

  return state
}
