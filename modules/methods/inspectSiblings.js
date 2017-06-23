import take from 'lodash.take'
import { className as validateClassName } from './validationHelpers'
/**
/**
 * Inspect the element's siblings by CSS Class names and compare them to the analyzed element.
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state) {
  hierarchy.forEach((currentElem, index) => {
    // get class attribute
    const currentClasses = (currentElem.el.getAttribute('class') || '')
      .replace(/^\s\s*/, '')
      .replace(/\s\s*$/, '')

    if (currentClasses && typeof currentClasses === 'string') {
      const validClasses = take(currentClasses.match(/([^\s]+)/gi) || [], 10)
        .filter(validateClassName)
        .map(className => `.${className}`)

      if (validClasses.length) {
        // limit to 10 classes
        state.stack[index].push(validClasses.join(''))
        state.specificity += 10 * validClasses.length
      }
    }
  })
  return state
}
