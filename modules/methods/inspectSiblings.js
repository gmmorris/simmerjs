/**
 * Inspect the element's siblings by CSS Class names and compare them to the analyzed element.
 * @param {array} hierarchy. The hierarchy of elements
 * @param {object} state. The current calculated CSS selector
 */
export default function (hierarchy, state) {
  var index, classIndex, currentElem, currentClasses, classes
  for (index = 0; index < hierarchy.length; index += 1) {
    currentElem = hierarchy[index]
    // get class attribute
    currentClasses = currentElem.el.getAttribute('class')
    if (currentClasses && typeof currentClasses === 'string') {
      // trim spaces
      currentClasses = currentClasses
        .replace(/^\s\s*/, '')
        .replace(/\s\s*$/, '')
      classes = currentClasses.match(/([^\s]+)/gi)
      if (classes) {
        if (classes.length > 0) {
          // add . before the first class
          classes[0] = '.' + classes[0]
        }
        // limit to 10 classes
        if (classes.length > 10) {
          classes.splice(10, classes.length - 10)
        }
        for (classIndex = 0; classIndex < classes.length; classIndex += 1) {
          if (!this.validationHelpers.className(classes[classIndex])) {
            classes.splice(classIndex, 1)
          }
        }
        state.stack[index].push(classes.join('.'))
        state.specificity += 10 * classes.length
      }
    }
  }
  return state
}
