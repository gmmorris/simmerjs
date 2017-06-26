import { isUniqueElementID } from '../queryEngine'
import { attr } from './validationHelpers'
/**
 * Inspect the elements' IDs and add them to the CSS Selector
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current selector state (has the stack and specificity sum)
 */
export default function (hierarchy, state, validateSelector, config, query) {
  var index, currentElem, currentID
  for (index = 0; index < hierarchy.length && !state.verified; index += 1) {
    currentElem = hierarchy[index]
    currentID = attr(currentElem.el.getAttribute('id'))
    // make sure the ID is unique
    if (currentID && isUniqueElementID(query, currentID)) {
      state.stack[index].push("[id='" + currentID + "']")
      state.specificity += 100

      // if the index is 0 then this is the ID of the actual element! Which means we have found our selector!
      if (index === 0) {
        // An ID provides the highest specificity so we start by verifying the query's success so that, maybe, this will be enough
        // Note that the first element in the hierarchy (index 0) is the actual element we are looking to parse
        if (validateSelector(state)) {
          // The ID worked like a charm - mark this state as verified and move on!
          state.verified = true
        } else {
          // The ID wasn't enough, this means the page, this should never happen as we tested for the ID's uniquness, but just incase
          // we will pop it from the stack as it only adds noise
          state.stack[index].pop()
          state.specificity -= 100
        }
      } else if (state.specificity >= config.specificityThreshold) {
        // we have reached the minimum specificity, lets try verifying now, as this will save us having to add more IDs to the selector
        if (validateSelector(state)) {
          // The ID worked like a charm - mark this state as verified and move on!
          state.verified = true
        }
      }
    }
  }
  return state
}
