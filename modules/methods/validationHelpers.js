/**
 * Validate the syntax of a tagName to make sure that it has a valid syntax for the query engine.
 * Many libraries use invalid property and tag names, such as Facebook that use FB: prefixed tags.
 * These make the query engines fail and must be filtered out.
 * @param {string} tagName. The element's tag name
 */
export function tagName (tagName) {
  if (
    typeof tagName === 'string' &&
    tagName.match(/^[a-zA-Z0-9]+$/gi) !== null
  ) {
    return tagName
  }
  return false
}
/**
 * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
 * @param {string} attribute. The element's attribute's value
 */
export function attr (attribute) {
  if (
    typeof attribute === 'string' &&
    attribute.match(/^[0-9a-zA-Z][a-zA-Z_\-:0-9.]*$/gi) !== null
  ) {
    return attribute
  }
  return false
}

/**
 * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
 * @param {string} attribute. The element's attribute's value
 */
export function className (className) {
  if (
    typeof className === 'string' &&
    className.match(/^\.?[a-zA-Z_\-:0-9]*$/gi) !== null
  ) {
    return className
  }
  return false
}
