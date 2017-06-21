import { wrap } from './queryEngine'
import parsingMethods from './methods'
import validateSelector from './validateSelector'
import convertSelectorStateIntoCSSSelector from './convertSelectorStateIntoCSSSelector'

export default function (window, QueryEngine, undefined) {
  /**
   * The top-level namespace
   * @namespace Simmer. A reverse CSS Selector parser.
   */
  let Simmer
  // Save the previous value of the `simmer` variable.
  let conflictedSimmer = window.Simmer
  // Configuration
  let config = {
    // A function for calling an external query engine for testing CSS selectors such as jQuery or Sizzle
    // (If you have jQuery or Sizzle on the page, you have no need to supply such a function as Simmer will detect
    // these and use them if they are available. this will not work if you have these libraries in noConflict mode.
    queryEngine: null,
    // A minimum specificty level. Once the parser reaches this level it starts verifying the selector after every method is called
    // This can cut down our execution time by avoiding needless parsing but can also hurt execution times by performing many
    // verifications. This number will have to be tweeked here and there as we use the component...
    specificityThreshold: 100,
    // How deep into the DOM hierarchy should Simmer go in order to reach a unique selector.
    // This is a delicate game because the higher the number the more likely you are to reach a unique selector,
    // but it also means a longer and more breakable one. Assuming you want to store this selector to use later,
    // making it longer also means it is more likely to change and loose it's validity.
    depth: 3,
    // Handling errors in the Simmer analysis process.
    // true / false / callback
    // false: errors are ignored by Simmer
    // true: errors rethrown by the process
    // a function callback will be called with two parameters: the exception and the element being analyzed
    errorHandling: e => {
      console.log({ e })
    },
    // A maximum length for the CSS selector can be specified - if no specific selector can be found which is shorter than this length
    // then it is treated as if no selector could be found
    selectorMaxLength: 512
  }

  /**
     * Handle errors in accordance with what is specified in the configuration
     * @param {object/string} ex. The exception object or message
     * @param {object} element. The element Simmer was asked to process
     */
  function onError (ex, element) {
    // handle error
    if (config.errorHandling === true) {
      throw ex
    }
    if (typeof config.errorHandling === 'function') {
      config.errorHandling(ex, element)
    }
  }

  const $DOM = new QueryEngine()
  /**
     * Retireve the element's ancestors up to the configured level.
     * This is an internal function and is not to be used from the outside (nor can it, it is private)
     * @param element (Object) The elemen't whose ancestry we want to retrieve
     * @param depth (number) How deep to into the heirarchy to collect elements
     */
  function stackHierarchy (element, depth) {
    const hierarchy = []

    for (let index = 0; index < depth && element !== null; index += 1) {
      hierarchy[index] = element
      element = hierarchy[index].parent()
    }

    return hierarchy
  }

  function Parser () {
    var queue = parsingMethods.getMethods()
    this.next = function (hierarchy, selectorState, config) {
      if (this.finished()) {
        return false
      }
      return queue.shift()(
        hierarchy,
        selectorState,
        config,
        validateSelector,
        $DOM
      )
    }
    this.finished = function () {
      return queue.length === 0
    }
  }

  // Initialize the Simmer object and set it over the reference on the window
  /**
   * The main Simmer action - parses an element on the page to produce a CSS selector for it.
   * This function will be returned into the global Simmer object.
   * @param {object} element. A DOM element you wish to create a selector for.
   * @example
   <code><pre>
   var cssSelectorForDonJulio = Simmer(document.getElementByID('DonJulio'));
   </pre></code>
   */
  Simmer = window.Simmer = function (element) {
    if (!element) {
      // handle error
      onError.call(
        Simmer,
        new Error('Simmer: No element was specified for parsing.'),
        element
      )
      return false
    }

    // The parser cycles through a set of parsing methods specified in an order optimal
    // for creating as specific as possible a selector
    const parser = new Parser()

    // get the element's ancestors (Note that $DOM isn't jQuery,  but rather a generic DOM wrapper)
    const hierarchy = stackHierarchy(wrap(element), config.depth)

    // initialize the state of the selector
    let selectorState = {
      // the stack is used to build a layer of selectors, each layer coresponding to a specific element in the heirarchy
      stack: [],
      // follow the current specificity level of the selector - the higher the better
      specificity: 0
    }

    // for each level we create a private stack of properties, so that we can then merge them
    // comfortably and allow all methods to see the level at which existing properties have
    // been set
    for (let index = 0; index < hierarchy.length; index += 1) {
      selectorState.stack[index] = []
    }
    // cycle through the available parsing methods and while we still have yet to find the requested element's one-to-one selector
    // we keep calling the methods until we are either satisfied or run out of methods
    while (!parser.finished() && !selectorState.verified) {
      try {
        selectorState = parser.next(hierarchy, selectorState, config)

        // if we have reached a satisfactory level of specificity, try the selector, perhaps we have found our selector?
        if (
          selectorState.specificity >= config.specificityThreshold &&
          !selectorState.verified
        ) {
          selectorState.verified = validateSelector(
            element,
            selectorState,
            config.selectorMaxLength,
            $DOM
          )
        }
      } catch (ex) {
        // handle error
        onError.call(Simmer, ex, element)
      }
    }

    // if we were not able to produce a one-to-one selector, return false
    if (
      selectorState.verified === undefined ||
      selectorState.specificity < config.specificityThreshold
    ) {
      // if it is undefined then verfication has never been run!
      // try and verify, and if verification fails - return false
      // if it is false and the specificity is too low to actually try and find the element in the first place, then we may simply have not run
      // an up to date verification - try again
      selectorState.verified = validateSelector(
        element,
        selectorState,
        config.selectorMaxLength,
        $DOM
      )
    }

    if (!selectorState.verified) {
      return false
    }

    if (selectorState.verificationDepth) {
      return convertSelectorStateIntoCSSSelector(
        selectorState,
        selectorState.verificationDepth
      )
    }
    return convertSelectorStateIntoCSSSelector(selectorState)
  }

  // by calling attachQueryEngine (currently null) we're essencially telling Simmer to perform an initial
  // search on the page for relevant libraries.
  // If the user chooses to change the configuration we'll trigger this again, otherwise this check will
  // already have been performed by the time the user wishes to use the library
  $DOM.attachQueryEngine(config.queryEngine, onError, Simmer)

  // Current version of the library.
  Simmer.VERSION = '0.3.0'

  /**
   * Revert the global window.simmer variable to it's original value and return this simmer object.
   * This allows users to include multiple versions of Simmer objects on a single page.
   * @example
   <code><pre>
   Simmer.noConflict();
   </pre></code>
   */
  Simmer.noConflict = function () {
    window.Simmer = conflictedSimmer
    return this
  }

  /**
   * Get/Set the configuration for the Simmer object
   * @param config (Object) A configuration object with any of the properties tweeked (none/depth/minimumSpecificity)
   * @example
   <code><pre>
   configuration({
            depth: 3
         });
   </pre></code>
   */
  Simmer.configuration = function (configValues) {
    var key, resetQueryEngine

    // If an object param is provided - replace the specific properties
    // it has set in the param with the equivalent property in the config
    if (configValues && configValues instanceof Object) {
      // check whether custom configurations have been specified, if so use them instead
      // of the defaults
      for (key in configValues) {
        if (configValues.hasOwnProperty(key) && config.hasOwnProperty(key)) {
          config[key] = configValues[key]
          if (key === 'queryEngine') {
            resetQueryEngine = true
          }
        }
      }
    }

    if (resetQueryEngine) {
      $DOM.attachQueryEngine(config.queryEngine, onError, Simmer)
    }

    // return the configuration object
    return config
  }
}
