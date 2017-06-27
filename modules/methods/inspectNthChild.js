import difference from 'lodash.difference'
import flatmap from 'lodash.flatmap'
/**
 * Inspect the element's siblings by index (nth-child) name and compare them to the analyzed element.
 * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */

const not = i => !i
const getNodeNames = siblings => siblings.map(sibling => sibling.el.nodeName)
/***
 * The main method splits up the hierarchy and isolates each element, while this helper method is designed
 * to then take each level in the hierarchy and fid into it's surounding siblings.
 * We've separated these to make the code more managable.
 * @param siblingElement
 * @param siblings
 * @returns {boolean}
 */
export function analyzeElementSiblings (element, siblings) {
  return (
    difference(
      element.getClasses(),
      flatmap(siblings, sibling => sibling.getClasses())
    ).length > 0 || not(getNodeNames(siblings).includes(element.el.nodeName))
  )
}

export default function (hierarchy, state, validateSelector) {
  return hierarchy.reduce((selectorState, currentElem, index) => {
    if (!selectorState.verified) {
      // get siblings BEFORE out element
      const prevSiblings = currentElem.prevAll()
      const nextSiblings = currentElem.nextAll()

      // get element's index by the number of elements before it
      // note that the nth-child selector uses a 1 based index, not 0
      const indexOfElement = prevSiblings.length + 1

      // If the element has no siblings!
      // we have no need for the nth-child selector
      if (
        (prevSiblings.length || nextSiblings.length) &&
        !analyzeElementSiblings(currentElem, [...prevSiblings, ...nextSiblings])
      ) {
        // if we don't have a unique tag or a unique class, then we need a nth-child to help us
        // differenciate our element from the rest of the pack
        selectorState.stack[index].push(`:nth-child(${indexOfElement})`)

        // Verify the selector as we don't want to go on and parse the parent's siblings
        // if we don't have to!
        selectorState.verified = validateSelector(selectorState)
      }
    }
    return selectorState
  }, state)
}
