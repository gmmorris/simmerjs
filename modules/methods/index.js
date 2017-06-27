import inspectElementID from './inspectElementID'
import inspectTags from './inspectTags'
import inspectSiblings from './inspectSiblings'
import inspectNthChild from './inspectNthChild'
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
  addMethod: function (fn) {
    this.methods.push(fn)
  }
}

parsingMethods.addMethod(inspectElementID)
parsingMethods.addMethod(inspectTags)
parsingMethods.addMethod(inspectSpecialAttributes)
parsingMethods.addMethod(inspectSiblings)
parsingMethods.addMethod(inspectNthChild)

export default parsingMethods
