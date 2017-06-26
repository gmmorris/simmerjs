import difference from 'lodash.difference'

/* the nth-child selector has proven unreliable on badly built webpages. It breaks when one of the siblings has a non closed <br>, for example  */
/**
 * Inspect the element's siblings by Tag name and Class name and compare them to the analyzed element.
 * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state, validateSelector) {
  let index
  let hierarchyIndex = 0
  let siblings
  let indexOfElement
  let currentElem
  let currentTag
  let elementTag
  let elementClasses
  let siblingClasses
  let hasUniqueTag
  let hasUniqueClass
  let uniqueClasses
  let typedIndex

  while (hierarchyIndex < hierarchy.length && !state.verified) {
    // get siblings BEFORE out element and reverse
    siblings = hierarchy[hierarchyIndex].prevAll().reverse()

    indexOfElement = siblings.length

    // add the rest of the siblings (those that come after ours)
    siblings = siblings.concat(hierarchy[hierarchyIndex].nextAll())

    // If the element has no siblings!
    // we have no need for the nth-child selector
    if (siblings.length !== 0) {
      elementTag = hierarchy[hierarchyIndex].el.nodeName
      elementClasses = hierarchy[hierarchyIndex].getClasses()
      siblingClasses = []
      hasUniqueTag = true // assume unique until proven otherwise
      hasUniqueClass =
        elementClasses[0] instanceof Array && elementClasses[0].length > 0 // if the element has no class, we may still need the nth-child filter
      typedIndex = 1 // the nth-of-type index of the element

      for (index = 0; index < siblings.length && hasUniqueTag; index += 1) {
        currentElem = siblings[index]
        // nodeName is not a jQuery property, so we must go directly to the element
        currentTag = currentElem.el.nodeName
        if (currentTag && currentTag === elementTag) {
          if (index < indexOfElement) {
            // only increment count if we have yet to reach the element
            typedIndex += 1
          }

          if (index + 1 >= indexOfElement) {
            // if we are about to reach the element's index end the loop
            // as we no longer need to count element with the same tag as his
            hasUniqueTag = false
          }
        }

        // push to stack of classes
        siblingClasses = siblingClasses.concat(currentElem.getClasses())
      }

      // get the classes that exist on the element but not on his siblings
      uniqueClasses = difference(elementClasses, siblingClasses)
      hasUniqueClass = uniqueClasses.length > 0

      // if we don't have a unique tag or a unique class, then we need a nth-child to help us
      // differenciate our element from the rest of the pack
      if (!hasUniqueClass && !hasUniqueTag) {
        state.stack[hierarchyIndex].push(':nth-of-type(' + typedIndex + ')')

        // Verify the selector as we don't want to go on and parse the parent's siblings
        // if we don't have to!
        state.verified = validateSelector(state)
      }
    }

    hierarchyIndex += 1
  }

  return state
}
