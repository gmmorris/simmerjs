import difference from 'lodash.difference'

export default function (window, QueryEngine, undefined) {
  var
    /**
     * The top-level namespace
     * @namespace Simmer. A reverse CSS Selector parser.
     */
    Simmer,
    // Save the previous value of the `simmer` variable.
    conflictedSimmer = window.Simmer,
    // Configuration
    config = {
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
      errorHandling: false,
      // A maximum length for the CSS selector can be specified - if no specific selector can be found which is shorter than this length
      // then it is treated as if no selector could be found
      selectorMaxLength: 512
    };

    /**
     * Handle errors in accordance with what is specified in the configuration
     * @param {object/string} ex. The exception object or message
     * @param {object} element. The element Simmer was asked to process
     */
    function onError (ex, element) {
      // handle error
      if (config.errorHandling === true) {
        throw ex;
      }
      if (typeof config.errorHandling === 'function') {
        config.errorHandling(ex, element);
      }
    }

    const $DOM = new QueryEngine();
    /**
     * Retireve the element's ancestors up to the configured level.
     * This is an internal function and is not to be used from the outside (nor can it, it is private)
     * @param element (Object) The elemen't whose ancestry we want to retrieve
     * @param depth (number) How deep to into the heirarchy to collect elements
     */
    function stackHierarchy (element, depth) {
      var hierarchy = [], index;

      for (index = 0; index < depth && element !== null; index += 1) {
        hierarchy[index] = element;
        element = hierarchy[index].parent();
      }

      return hierarchy;
    }

    
    /**
     * Conver the Selector State into a merged CSS selector
     * @param state (object) The current selector state (has the stack and specificity sum)
     * @param depth (int) The number of levels to merge (1..state.stack.length)
     */
    function convertSelectorStateIntoCSSSelector (state, depth) {
      depth = depth || (state.stack.length);

      var selectorSegments = [],
        rejectableLayers = 0,
        index;

      // cycle through the layers from the top down to the analyzed element
      for (index = depth - 1; index >= 0; index -= 1) {
        if (state.stack[index].length === 0) {
          // if no details were obtainable on this element, and this is not the 'top' layer (which we simply ignore),
          // place the 'all' placeholder in there for the selector
          if (index !== depth - 1 - rejectableLayers) {
            selectorSegments.push('*');
          } else {
            // count how many ancestors layers have been rejected
            // so we can ignore them later
            rejectableLayers += 1;
          }
        } else {
          selectorSegments.push(state.stack[index].join(''));
        }
      }

      // join as a hierarchy selector, in reverse order from top to bottom
      return selectorSegments.join(' > ');
    }

    /**
     * Execute a query using the current selector state and see if it produces a unique result.
     * If the result is unique then the analysis is complete and we can finish the process.
     * @param {object} element. The element we are trying to build a selector for
     * @param {object} state. The current selector state (has the stack and specificity sum)
     */
    function analyzeSelectorState (element, state, selectorMaxLength) {
      var validated = false, depth, selector, results;
      for (depth = 1; depth <= state.stack.length && !validated; depth += 1) {
        // use selector to query an element and see if it is a one-to-one selection

        selector = convertSelectorStateIntoCSSSelector(state, depth);

        if (selectorMaxLength && selector.length > selectorMaxLength) {
          // the selector is too long
          return false;
        }

        results = $DOM.query(selector);
        validated = (results.length === 1 && (element.el !== undefined ? (results[0] === element.el) : (results[0] === element)));

        // we have to mark how deep the valdiation passed at
        if (validated) {
          state.verificationDepth = depth;
        }
      }

      return validated;
    }
    /**
     * The ParsingMethods are the key methods for the parsing process. They provide the various ways by which we analyze an element.
     * This object is a wrapper for building the list of available parsing methods and managing the context in which they are run so
     * that they all have access to basic parsing helper methods
     * */
    const parsingMethods = {
      methods : [],
      getMethods : function () {
        return this.methods.slice(0);
      },
      addMethod : function (fn, context) {
        context = (context && typeof context === 'object' ? context : this);
        this.methods.push(fn.bind(context));
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
          if (typeof tagName === 'string' && tagName.match(/^[a-zA-Z0-9]+$/gi) !== null) {
            return tagName;
          }
          return false;
        },
        /**
         * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
         * @param {string} attribute. The element's attribute's value
         */
        attr: function (attribute) {
          if (typeof attribute === 'string' && attribute.match(/^[0-9a-zA-Z][a-zA-Z_\-\:0-9\.]*$/gi) !== null) {
            return attribute;
          }
          return false;
        },

        /**
         * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
         * @param {string} attribute. The element's attribute's value
         */
        className: function (className) {
          if (typeof className === 'string' && className.match(/^\.?[a-zA-Z_\-\:0-9]*$/gi) !== null) {
            return className;
          }
          return false;
        }
      }
    };

    function Parser () {
      var queue = parsingMethods.getMethods();
      this.next = function (hierarchy, selectorState, config) {
        if (this.finished()) {
          return false;
        }
        return queue.shift()(hierarchy, selectorState, config);
      };
      this.finished = function () {
        return queue.length === 0;
      };
    };

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
      onError.call(Simmer, new Error('Simmer: No element was specified for parsing.'), element);
      return false;
    }

    // get the element's ancestors (Note that $DOM isn't jQuery,  but rather a generic DOM wrapper)
    var hierarchy = stackHierarchy($DOM.wrap(element), config.depth),
      // initialize the state of the selector
      selectorState = {
        // the stack is used to build a layer of selectors, each layer coresponding to a specific element in the heirarchy
        'stack': [],
        // follow the current specificity level of the selector - the higher the better
        'specificity': 0
      },
      index,
      // The parser cycled through a set of parsing methods specified in an order optimal
      // for creating as specific as possible a selector
      parser = new Parser();

    // for each level we create a private stack of properties, so that we can then merge them
    // comfortably and allow all methods to see the level at which existing properties have
    // been set
    for (index = 0; index < hierarchy.length; index += 1) {
      selectorState.stack[index] = [];
    }


    // cycle through the available parsing methods and while we still have yet to find the requested element's one-to-one selector
    // we keep calling the methods until we are either satisfied or run out of methods
    while (!parser.finished() && !(selectorState.verified)) {
      try {
        selectorState = parser.next(hierarchy, selectorState, config);

        // if we have reached a satisfactory level of specificity, try the selector, perhaps we have found our selector?
        if (selectorState.specificity >= config.specificityThreshold && !(selectorState.verified)) {
          selectorState.verified = analyzeSelectorState(element, selectorState, config.selectorMaxLength);
        }
      } catch (ex) {
        // handle error
        onError.call(Simmer, ex, element);
      }
    }

    // if we were not able to produce a one-to-one selector, return false
    if (selectorState.verified === undefined || selectorState.specificity < config.specificityThreshold) {
      // if it is undefined then verfication has never been run!
      // try and verify, and if verification fails - return false
      // if it is false and the specificity is too low to actually try and find the element in the first place, then we may simply have not run
      // an up to date verification - try again
      selectorState.verified = analyzeSelectorState(element, selectorState, config.selectorMaxLength);
    }

    if (!selectorState.verified) {
      return false;
    }

    if (selectorState.verificationDepth) {
      return convertSelectorStateIntoCSSSelector(selectorState, selectorState.verificationDepth);
    }
    return convertSelectorStateIntoCSSSelector(selectorState);
  };

  // by calling attachQueryEngine (currently null) we're essencially telling Simmer to perform an initial
  // search on the page for relevant libraries.
  // If the user chooses to change the configuration we'll trigger this again, otherwise this check will
  // already have been performed by the time the user wishes to use the library
  $DOM.attachQueryEngine(config.queryEngine, onError, Simmer);

  // Current version of the library.
  Simmer.VERSION = '0.3.0';

  /**
   * Revert the global window.simmer variable to it's original value and return this simmer object.
   * This allows users to include multiple versions of Simmer objects on a single page.
   * @example
   <code><pre>
   Simmer.noConflict();
   </pre></code>
   */
  Simmer.noConflict = function () {
    window.Simmer = conflictedSimmer;
    return this;
  };

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
    var key, resetQueryEngine;

    // If an object param is provided - replace the specific properties
    // it has set in the param with the equivalent property in the config
    if (configValues && configValues instanceof Object) {
      // check whether custom configurations have been specified, if so use them instead
      // of the defaults
      for (key in configValues) {
        if (configValues.hasOwnProperty(key) && config.hasOwnProperty(key)) {
          config[key] = configValues[key];
          if (key === 'queryEngine') {
            resetQueryEngine = true;
          }
        }
      }
    }

    if (resetQueryEngine) {
      $DOM.attachQueryEngine(config.queryEngine, onError, Simmer);
    }

    // return the configuration object
    return config;
  };

  /****
   * ======================
   * Actual parsing methods
   * ======================
   */
  /*
   Currently we have disabled the 'analyzeTypedSiblings' method.
   the nth-of-type selector has been removed due to the fact that
   it is unreliable and even  Sizzle doesn't support it.
   */
  /**
   * Inspect the elements' IDs and add them to the CSS Selector
   * @param {array} hierarchy. The hierarchy of elements
   * @param {object} state. The current selector state (has the stack and specificity sum)
   */
  parsingMethods.addMethod(function (hierarchy, state, config) {
    var index, currentElem, currentID;
    for (index = 0; index < hierarchy.length && !state.verified; index += 1) {
      currentElem = hierarchy[index];
      currentID = this.validationHelpers.attr(currentElem.attr('id'));
      // make sure the ID is unique
      if (currentID && $DOM.isUniqueElementID(currentID)) {

        state.stack[index].push('[id=\'' + currentID + '\']');
        state.specificity += 100;

        // if the index is 0 then this is the ID of the actual element! Which means we have found our selector!
        if (index === 0) {
          // An ID provides the highest specificity so we start by verifying the query's success so that, maybe, this will be enough
          // Note that the first element in the hierarchy (index 0) is the actual element we are looking to parse
          if (analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength)) {
            // The ID worked like a charm - mark this state as verified and move on!
            state.verified = true;
          } else {
            // The ID wasn't enough, this means the page, this should never happen as we tested for the ID's uniquness, but just incase
            // we will pop it from the stack as it only adds noise
            state.stack[index].pop();
            state.specificity -= 100;
          }
        } else if (state.specificity >= config.specificityThreshold) {
          // we have reached the minimum specificity, lets try verifying now, as this will save us having to add more IDs to the selector
          if (analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength)) {
            // The ID worked like a charm - mark this state as verified and move on!
            state.verified = true;
          }
        }

      }
    }
    return state;
  });

  /**
   * Inspect the elements' Tag names and add them to the calculates CSS selector
   * @param {array} hierarchy. The hierarchy of elements
   * @param {object} state. The current calculated CSS selector
   */
  parsingMethods.addMethod(function (hierarchy, state) {
    var index, currentElem, currentTag;
    for (index = 0; index < hierarchy.length; index += 1) {
      currentElem = hierarchy[index];
      currentTag = this.validationHelpers.tagName(currentElem.getTag());

      if (currentTag) {
        state.stack[index].splice(0, 0, currentTag);
        state.specificity += 10;
      }
    }

    return state;
  });

  /**
   * Inspect the elements' special attributes which are likely to be unique to the element
   * @param {array} hierarchy. The hierarchy of elements
   * @param {object} state. The current calculated CSS selector
   */
  parsingMethods.addMethod(function (hierarchy, state, config) {
    var elm = hierarchy[0],
      tag = elm.getTag(),
      attribute;

    switch (tag) {
    case 'A':
      attribute = elm.attr('href');
      if (attribute) {
        state.stack[0].push('A[href="' + attribute + '"]');
        state.specificity += 10;
      }
      break;
    case 'IMG':
      attribute = elm.attr('src');
      if (attribute) {
        state.stack[0].push('IMG[src="' + attribute + '"]');
        state.specificity += 10;
      }
      break;
    default:
      // nothing to do here
      return state;
    }

    if (analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength)) {
      // the unique attribute worked!
      state.verified = true;
    } else {
      // turns out our so called unique attribute isn't as unique as we thought,
      // we'll remove it to keep the selector's noise level down
      state.stack[0].pop();
    }

    return state;
  });

  /**
   * Inspect the element's siblings by CSS Class names and compare them to the analyzed element.
   * @param {array} hierarchy. The hierarchy of elements
   * @param {object} state. The current calculated CSS selector
   */
  parsingMethods.addMethod(function (hierarchy, state) {
    var index, classIndex, currentElem, currentClasses, classes;
    for (index = 0; index < hierarchy.length; index += 1) {
      currentElem = hierarchy[index];
      // get class attribute
      currentClasses = currentElem.attr('class');
      if (currentClasses && typeof currentClasses === 'string') {
        // trim spaces
        currentClasses = currentClasses.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        classes = currentClasses.match(/([^\s]+)/gi);
        if (classes) {
          if (classes.length > 0) {
            // add . before the first class
            classes[0] = '.' + classes[0];
          }
          //limit to 10 classes
          if (classes.length > 10) {
            classes.splice(10, classes.length - 10);
          }
          for (classIndex = 0; classIndex < classes.length; classIndex += 1) {
            if (!this.validationHelpers.className(classes[classIndex])) {
              classes.splice(classIndex, 1);
            }
          }
          state.stack[index].push(classes.join('.'));
          state.specificity += (10 * classes.length);
        }
      }
    }
    return state;
  });

  /**
   * Inspect the element's siblings by index (nth-child) name and compare them to the analyzed element.
   * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
   * @param {array} hierarchy. The hierarchy of elements
   * @param {object} state. The current calculated CSS selector
   */
  parsingMethods.addMethod(function (hierarchy, state, config) {
    var hierarchyIndex = 0, siblings, indexOfElement, hasUniqueClassOrTag;

    while (hierarchyIndex < hierarchy.length && !state.verified) {
      // get siblings BEFORE out element
      siblings = hierarchy[hierarchyIndex].prevAll();

      // get element's index by the number of elements before it
      // note that the nth-child selector uses a 1 based index, not 0
      indexOfElement = siblings.length + 1;

      // add the rest of the siblings (those that come after ours)
      siblings = siblings.concat(hierarchy[hierarchyIndex].nextAll());

      // If the element has no siblings!
      // we have no need for the nth-child selector
      if (siblings.length !== 0) {
        // if we don't have a unique tag or a unique class, then we need a nth-child to help us
        // differenciate our element from the rest of the pack
        hasUniqueClassOrTag = this.analyzeElementSiblings(hierarchy[hierarchyIndex], siblings);
        if (!hasUniqueClassOrTag) {
          state.stack[hierarchyIndex].push(':nth-child(' + indexOfElement + ')');

          // Verify the selector as we don't want to go on and parse the parent's siblings
          // if we don't have to!
          state.verified = analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength);
        }
      }

      hierarchyIndex += 1;
    }

    return state;
  }, {
    /***
     * The main method splits up the hierarchy and isolates each element, while this helper method is designed
     * to then take each level in the hierarchy and fid into it's surounding siblings.
     * We've separated these to make the code more managable.
     * @param siblingElement
     * @param siblings
     * @returns {boolean}
     */
    analyzeElementSiblings: function (siblingElement, siblings) {
      var index,
        elementTag = siblingElement.getTag(),
        elementClasses = siblingElement.getClasses(),
        // assume unique until proven otherwise
        hasUniqueTag = true,
        // if the element has no class, we may still need the nth-child filter
        hasUniqueClass = (elementClasses[0] instanceof Array && elementClasses[0].length > 0),
        currentElem,
        currentTag;

      for (index = 0; index < siblings.length && (hasUniqueClass || hasUniqueTag); index += 1) {
        currentElem = siblings[index];
        // nodeName is not a jQuery property, so we must go directly to the element
        currentTag = currentElem.getTag();
        if (currentTag && currentTag === elementTag) {
          hasUniqueTag = false;
        }

        // get the classes that exist on the element but not on his sibling
        hasUniqueClass = (difference(elementClasses, currentElem.getClasses()).length > 0);
      }

      // if we don't have a unique tag or a unique class, then we need a nth-child to help us
      // differenciate our element from the rest of the pack
      return hasUniqueClass || hasUniqueTag;
    }
  });

  /* the nth-child selector has proven unreliable on badly built webpages. It breaks when one of the siblings has a non closed <br>, for example  */
  /**
   * Inspect the element's siblings by Tag name and Class name and compare them to the analyzed element.
   * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
   * @param {array} hierarchy. The hierarchy of elements
   * @param {object} state. The current calculated CSS selector
   */
  //parsingMethods.addMethod(function (hierarchy, state, config) {
  //
  //  var index, hierarchyIndex = 0,
  //  siblings, indexOfElement,
  //  currentElem, currentTag,
  //  elementTag, elementClasses, siblingClasses, hasUniqueTag, hasUniqueClass, uniqueClasses, typedIndex;
  //  while (hierarchyIndex < hierarchy.length && !state.verified) {
  //    // get siblings BEFORE out element and reverse
  //    siblings = hierarchy[hierarchyIndex].prevAll().reverse();
  //
  //    indexOfElement = siblings.length;
  //
  //    // add the rest of the siblings (those that come after ours)
  //    siblings = siblings.concat(hierarchy[hierarchyIndex].nextAll());
  //
  //    // If the element has no siblings!
  //    // we have no need for the nth-child selector
  //    if (siblings.length !== 0) {
  //      elementTag = hierarchy[hierarchyIndex].getTag();
  //      elementClasses = hierarchy[hierarchyIndex].getClasses();
  //      siblingClasses = [];
  //      hasUniqueTag = true; // assume unique until proven otherwise
  //      hasUniqueClass = (elementClasses[0] instanceof Array && elementClasses[0].length > 0); // if the element has no class, we may still need the nth-child filter
  //      typedIndex = 1; // the nth-of-type index of the element
  //
  //      for (index = 0; index < siblings.length && (hasUniqueClass || hasUniqueTag); index += 1) {
  //        currentElem = siblings[index];
  //        // nodeName is not a jQuery property, so we must go directly to the element
  //        currentTag = currentElem.getTag();
  //        if (currentTag && currentTag === elementTag) {
  //          if (index < indexOfElement) {
  //            //only increment count if we have yet to reach the element
  //            typedIndex += 1;
  //          }
  //
  //          if (index + 1 >= indexOfElement) {
  //            // if we are about to reach the element's index end the loop
  //            // as we no longer need to count element with the same tag as his
  //            hasUniqueTag = false;
  //          }
  //        }
  //
  //        // push to stack of classes
  //        siblingClasses = siblingClasses.concat(currentElem.getClasses());
  //      }
  //
  //      // get the classes that exist on the element but not on his siblings
  //      uniqueClasses = difference(elementClasses, siblingClasses);
  //      hasUniqueClass = (uniqueClasses.length > 0);
  //
  //      // if we don't have a unique tag or a unique class, then we need a nth-child to help us
  //      // differenciate our element from the rest of the pack
  //      if (!hasUniqueClass && !hasUniqueTag) {
  //        state.stack[hierarchyIndex].push(':nth-of-type(' + typedIndex + ')');
  //
  //        // Verify the selector as we don't want to go on and parse the parent's siblings
  //        // if we don't have to!
  //        state.verified = analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength);
  //      }
  //    }
  //
  //    hierarchyIndex += 1;
  //  }
  //
  //  return state;
  //});

}