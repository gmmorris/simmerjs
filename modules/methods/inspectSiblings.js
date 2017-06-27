import take from 'lodash.take'
import { className as validateClassName } from './validationHelpers'
/**
/**
 * Inspect the element's siblings by CSS Class names and compare them to the analyzed element.
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state) {
  return hierarchy.reduce((selectorState, currentElem, index) => {
    const validClasses = take(currentElem.getClasses(), 10)
      .filter(validateClassName)
      .map(className => `.${className}`)

    if (validClasses.length) {
      // limit to 10 classes
      selectorState.stack[index].push(validClasses.join(''))
      selectorState.specificity += 10 * validClasses.length
    }
    return selectorState
  }, state)
}
