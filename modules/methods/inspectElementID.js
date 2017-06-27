import { isUniqueElementID } from '../queryEngine'
import { attr } from './validationHelpers'
/**
 * Inspect the elements' IDs and add them to the CSS Selector
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current selector state (has the stack and specificity sum)
 */
export default function (hierarchy, state, validateSelector, config, query) {
  return hierarchy.reduce((selectorState, currentElem, index) => {
    if (!selectorState.verified) {
      const [validatedState] = [currentElem.el.getAttribute('id')]
        .filter(id => attr(id))
        // make sure the ID is unique
        .filter(id => isUniqueElementID(query, id))
        .map(validId => {
          selectorState.stack[index].push(`[id='${validId}']`)
          selectorState.specificity += 100

          if (selectorState.specificity >= config.specificityThreshold) {
            // we have reached the minimum specificity, lets try verifying now, as this will save us having to add more IDs to the selector
            if (validateSelector(selectorState)) {
              // The ID worked like a charm - mark this state as verified and move on!
              selectorState.verified = true
            }
          }

          if (!selectorState.verified && index === 0) {
            // if the index is 0 then this is the ID of the actual element! Which means we have found our selector!
            // The ID wasn't enough, this means the page, this should never happen as we tested for the ID's uniquness, but just incase
            // we will pop it from the stack as it only adds noise
            selectorState.stack[index].pop()
            selectorState.specificity -= 100
          }
          return selectorState
        })
      return validatedState || selectorState
    }
    return selectorState
  }, state)
}
