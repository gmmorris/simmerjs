import inspectElementID from './inspectElementID'
import inspectTags from './inspectTags'
import inspectSiblings from './inspectSiblings'
import inspectNthChild, { context as inspectNthChildContext } from './inspectNthChild'
import inspectSpecialAttributes from './inspectSpecialAttributes'

/**
 * The ParsingMethods are the key methods for the parsing process. They provide the various ways by which we analyze an element.
 * This object is a wrapper for building the list of available parsing methods and managing the context in which they are run so
 * that they all have access to basic parsing helper methods
 * */
const parsingMethods = {
  methods: [],
  getMethods: function () {
    return this.methods.slice(0)
  },
  addMethod: function (fn, context) {
    context = context && typeof context === 'object' ? context : this
    this.methods.push(fn.bind(context))
  },
  // Internal functions for the parsing process
  validationHelpers: {
    /**
     * Validate the syntax of a tagName to make sure that it has a valid syntax for the query engine.
     * Many libraries use invalid property and tag names, such as Facebook that use FB: prefixed tags.
     * These make the query engines fail and must be filtered out.
     * @param {string} tagName. The element's tag name
     */
    tagName: function (tagName) {
      if (
        typeof tagName === 'string' &&
        tagName.match(/^[a-zA-Z0-9]+$/gi) !== null
      ) {
        return tagName
      }
      return false
    },
    /**
     * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
     * @param {string} attribute. The element's attribute's value
     */
    attr: function (attribute) {
      if (
        typeof attribute === 'string' &&
        attribute.match(/^[0-9a-zA-Z][a-zA-Z_\-:0-9.]*$/gi) !== null
      ) {
        return attribute
      }
      return false
    },

    /**
         * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
         * @param {string} attribute. The element's attribute's value
         */
    className: function (className) {
      if (
        typeof className === 'string' &&
        className.match(/^\.?[a-zA-Z_\-:0-9]*$/gi) !== null
      ) {
        return className
      }
      return false
    }
  }
}

parsingMethods.addMethod(inspectElementID)
parsingMethods.addMethod(inspectTags)
parsingMethods.addMethod(inspectSpecialAttributes)
parsingMethods.addMethod(inspectSiblings)
parsingMethods.addMethod(inspectNthChild, inspectNthChildContext)

export default parsingMethods
