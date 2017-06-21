import difference from 'lodash.difference'
/**
 * Inspect the element's siblings by index (nth-child) name and compare them to the analyzed element.
 * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export const context = {
  /***
 * The main method splits up the hierarchy and isolates each element, while this helper method is designed
 * to then take each level in the hierarchy and fid into it's surounding siblings.
 * We've separated these to make the code more managable.
 * @param siblingElement
 * @param siblings
 * @returns {boolean}
 */
  analyzeElementSiblings: function (siblingElement, siblings) {
    let index
    let elementTag = siblingElement.el.nodeName
    let elementClasses = siblingElement.getClasses()
    // assume unique until proven otherwise
    let hasUniqueTag = true
    // if the element has no class, we may still need the nth-child filter
    let hasUniqueClass =
      elementClasses[0] instanceof Array && elementClasses[0].length > 0
    let currentElem
    let currentTag

    for (
      index = 0;
      index < siblings.length && (hasUniqueClass || hasUniqueTag);
      index += 1
    ) {
      currentElem = siblings[index]
      // nodeName is not a jQuery property, so we must go directly to the element
      currentTag = currentElem.el.nodeName
      if (currentTag && currentTag === elementTag) {
        hasUniqueTag = false
      }

      // get the classes that exist on the element but not on his sibling
      hasUniqueClass =
        difference(elementClasses, currentElem.getClasses()).length > 0
    }

    // if we don't have a unique tag or a unique class, then we need a nth-child to help us
    // differenciate our element from the rest of the pack
    return hasUniqueClass || hasUniqueTag
  }
}

export default function (
  hierarchy,
  state,
  config,
  validateSelector,
  query,
  onError
) {
  let hierarchyIndex = 0
  let siblings
  let indexOfElement
  let hasUniqueClassOrTag

  while (hierarchyIndex < hierarchy.length && !state.verified) {
    // get siblings BEFORE out element
    siblings = hierarchy[hierarchyIndex].prevAll()

    // get element's index by the number of elements before it
    // note that the nth-child selector uses a 1 based index, not 0
    indexOfElement = siblings.length + 1

    // add the rest of the siblings (those that come after ours)
    siblings = siblings.concat(hierarchy[hierarchyIndex].nextAll())

    // If the element has no siblings!
    // we have no need for the nth-child selector
    if (siblings.length !== 0) {
      // if we don't have a unique tag or a unique class, then we need a nth-child to help us
      // differenciate our element from the rest of the pack
      hasUniqueClassOrTag = this.analyzeElementSiblings(
        hierarchy[hierarchyIndex],
        siblings
      )
      if (!hasUniqueClassOrTag) {
        state.stack[hierarchyIndex].push(':nth-child(' + indexOfElement + ')')

        // Verify the selector as we don't want to go on and parse the parent's siblings
        // if we don't have to!
        state.verified = validateSelector(
          hierarchy[0],
          state,
          config.selectorMaxLength,
          query,
          onError
        )
      }
    }

    hierarchyIndex += 1
  }

  return state
}
