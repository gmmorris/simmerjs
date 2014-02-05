/**
 * @name kanakanak.js
 * @author Gidi Morris, 2014
 * @version 0.1
 */
(function (window,document,undefined) {

    /**
     * The top-level namespace
     * @namespace KanakanaK. A reverse CSS Selector parser.
     */
    var KanakanaK;

    // Save the previous value of the `kanakanak` variable.
    var conflictedKanakanaK = window.KanakanaK;

    // Initialize the KanakanaK object and set it over the reference on the window
    /**
     * The main KanakanaK action - parses an element on the page to produce a CSS selector for it.
     * This function will be returned into the global KanakanaK object.
     * @param {object} element. A DOM element you wish to create a selector for.
     * @example
     <code><pre>
     var cssSelectorForDonJulio = KanakanaK(document.getElementByID('DonJulio'));
     </pre></code>
     */
    KanakanaK = window.KanakanaK = function (element) {

        if (!element) {
            // handle error
            onError.call(
                KanakanaK,
                new Error('KanakanaK: No element was specified for parsing.'),
                element);

            return false;
        }

        // get the element's ancestors (Note that $ isn't jQuery,  but rather a generic DOM wrapper)
        var hierarchy = stackHierarchy($.wrap(element), config.depth);

        // initialize the state of the selector
        var selectorState = {
            // the stack is used to build a layer of selectors, each layer coresponding to a specific element in the heirarchy
            "stack"      :[],
            // follow the current specificity level of the selector - the higher the better
            "specificity":0
        };

        // for each level we create a private stack of properties, so that we can then merge them
        // comfortably and allow all methods to see the level at which existing properties have
        // been set
        for (var index = 0; index < hierarchy.length; index++) {
            selectorState.stack[index] = [];
        }

        // get an array of methods to be used for parsing.
        // These will be executed in the order that they are returned.
        var parsingMethods = parsingLogic.methods();

        // cycle through the available parsing methods and while we still have yet to find the requested element's one-to-one selector
        // we keep calling the methods until we are either satisfied or run out of methods
        while (parsingMethods.length > 0 && !(selectorState.verified)) {
            try {
                selectorState = parsingMethods.shift().call(KanakanaK, hierarchy, selectorState, config);

                // if we have reached a satisfactory level of specificity, try the selector, perhaps we have found our selector?
                if (selectorState.specificity >= config.specifictyThreshold && !(selectorState.verified)) {
                    selectorState.verified = analyzeSelectorState(element, selectorState, config.selectorMaxLength);
                }
            } catch (ex) {
                // handle error
                onError.call(KanakanaK, ex, element);
            }
        }

        // if we were not able to produce a one-to-one selector, return false
        if (selectorState.verified === undefined || selectorState.specificity < config.specifictyThreshold) {
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

    // Current version of the library.
    KanakanaK.VERSION = '0.1';

    // Configuration
    var config = {

        // A function for calling an external query engine for testing CSS selectors such as jQuery or Sizzle
        // (If you have jQuery or Sizzle on the page, you have no need to supply such a function as KanakanaK will detect
        // these and use them if they are available. this will not work if you have these libraries in noConflict mode.
        queryEngine :null,

        // A minimum specificty level. Once the parser reaches this level it starts verifying the selector after every method is called
        // This can cut down our execution time by avoiding needless parsing but can also hurt execution times by performing many
        // verifications. This number will have to be tweeked here and there as we use the component...
        specifictyThreshold:100,

        // How deep into the DOM hierarchy should KanakanaK go in order to reach a unique selector.
        // This is a delicate game because the higher the number the more likely you are to reach a unique selector,
        // but it also means a longer and more breakable one. Assuming you want to store this selector to use later,
        // making it longer also means it is more likely to change and loose it's validity.
        depth   :3,

        // Handling errors in the KanakanaK analysis process.
        // true / false / callback
        // false: errors are ignored by KanakanaK
        // true: errors rethrown by the process
        // a function callback will be called with two parameters: the exception and the element being analyzed
        errorHandling    :false,

        // A maximum length for the CSS selector can be specified - if no specific selector can be found which is shorter than this length
        // then it is treated as if no selector could be found
        selectorMaxLength:512
    };

    /**
     * Revert the global window.Kanakanak variable to it's original value and return this Kanakanak object.
     * This allows users to include multiple versions of KanakanaK objects on a single page.
     * @example
     <code><pre>
     KanakanaK.noConflict();
     </pre></code>
     */
    KanakanaK.noConflict = function () {
        window.KanakanaK = conflictedKanakanaK;
        return this;
    };

    /**
     * Get/Set the configuration for the KanakanaK object
     * @param config (Object) A configuration object with any of the properties tweeked (none/depth/minimumSpecificity)
     * @example
     <code><pre>
        configuration({
            depth: 3
         });
     </pre></code>
     */
    KanakanaK.configuration = function (configValues) {

        // If an object param is provided - replace the specific properties
        // it has set in the param with the equivalent property in the config
        if(configValues && configValues instanceof Object) {
            // check whether custom configurations have been specified, if so use them instead
            // of the defaults
            for (var key in configValues) {
                if (config.hasOwnProperty(key) && configValues.hasOwnProperty(key)) {
                    config[key] = configValues[key];
                }
            }
        }

        // return the configuration object
        return config;
    };


    // internal methods


    /**
     * Retireve the element's ancestors up to the configured level.
     * This is an internal function and is not to be used from the outside (nor can it, it is private)
     * @param element (Object) The elemen't whose ancestry we want to retrieve
     * @param depth (number) How deep to into the heirarchy to collect elements
     */
    var stackHierarchy = function (element, depth) {
        var hierarchy = [];

        for (var index = 0; index < depth && element != null; index++) {
            hierarchy[index] = element;
            element = hierarchy[index].parent();
        }

        return hierarchy;
    };

    /**
     * Conver the Selector State into a merged CSS selector
     * @param state (object) The current selector state (has the stack and specificity sum)
     * @param depth (int) The number of levels to merge (1..state.stack.length)
     */
    var convertSelectorStateIntoCSSSelector = function (state, depth) {

        depth = depth || (state.stack.length);

        var selectorSegments = [],
            rejectableLayers = 0;

        // cycle through the layers from the top down to the analyzed element
        for (var index = depth - 1; index >= 0; index--) {
            if (state.stack[index].length == 0) {
                // if no details were obtainable on this element, and this is not the "top" layer (which we simply ignore),
                // place the 'all' placeholder in there for the selector
                if (index !== depth - 1 - rejectableLayers) {
                    selectorSegments.push('*');
                } else {
                    // count how many ancestors layers have been rejected
                    // so we can ignore them later
                    rejectableLayers++;
                }
            } else {
                selectorSegments.push(state.stack[index].join(''));
            }
        }

        // join as a hierarchy selector, in reverse order from top to bottom
        return selectorSegments.join(' > ');
    };

    /**
     * Execute a query using the current selector state and see if it produces a unique result.
     * If the result is unique then the analysis is complete and we can finish the process.
     * @param {object} element. The element we are trying to build a selector for
     * @param {object} state. The current selector state (has the stack and specificity sum)
     */
    var analyzeSelectorState = function (element, state, selectorMaxLength) {
        var validated = false;
        for (var depth = 1; depth <= state.stack.length && !validated; depth++) {
            // use selector to query an element and see if it is a one-to-one selection

            var selector = convertSelectorStateIntoCSSSelector(state, depth);

            if (selectorMaxLength && selector.length > selectorMaxLength) {
                // the selector is too long
                return false;
            }

            var results = $.query(selector);
            validated = (results.length === 1 && (element.el != undefined ? (results[0] === element.el) : (results[0] === element)));

            // we have to mark how deep the valdiation passed at
            if (validated) {
                state.verificationDepth = depth;
            }
        }

        return validated;
    };

    /***
     * The ParsingMethods are the key methods for the parsing process.
     * They provide the various ways by which we analyze an element.
     * @type {{}}
     */
    var parsingLogic = new (function() {

        // Actual parsing methods

        /**
         * Inspect the elements' IDs and add them to the CSS Selector
         * @param {array} hierarchy. The hierarchy of elements
         * @param {object} state. The current selector state (has the stack and specificity sum)
         */
        var analyzeElementID = function (hierarchy, state, config) {

            for (var index = 0; index < hierarchy.length && !state.verified; index++) {
                var currentElem = hierarchy[index];
                var currentID = validationHelpers.attr(currentElem.attr("id"));
                // make sure the ID is unique
                if (currentID && $.isUniqueElementID(currentID)) {

                    state.stack[index].push("[id='"+ currentID + "']");
                    state.specificity += 100;

                    // if the index is 0 then this is the ID of the actual element! Which means we have found our selector!
                    if (index == 0) {
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
                    } else if (state.specificity >= config.specifictyThreshold) {
                        // we have reached the minimum specificity, lets try verifying now, as this will save us having to add more IDs to the selector
                        if (analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength)) {
                            // The ID worked like a charm - mark this state as verified and move on!
                            state.verified = true;
                        }
                    }

                }
            }

            return state;
        };

        /**
         * Inspect the elements' Tag names and add them to the calculates CSS selector
         * @param {array} hierarchy. The hierarchy of elements
         * @param {object} state. The current calculated CSS selector
         */
         var analyzeElementTag = function (hierarchy, state, config) {

            for (var index = 0; index < hierarchy.length; index++) {
                var currentElem = hierarchy[index];
                var currentTag = validationHelpers.tagName(currentElem.getTag());

                if (currentTag) {
                    state.stack[index].splice(0, 0, currentTag);
                    state.specificity += 10;
                }
            }

            return state;
        };

        /**
         * Inspect the elements' special attributes which are likely to be unique to the element
         * @param {array} hierarchy. The hierarchy of elements
         * @param {object} state. The current calculated CSS selector
         */
        var analyzeElementAttributes = function (hierarchy, state, config) {

            var elm = hierarchy[0],
                tag = elm.getTag();


            switch (tag) {
                case 'A':
                    var attribute = elm.attr('href');
                    if (attribute) {
                        state.stack[0].push("A[href=\"" + attribute + "\"]");
                        state.specificity += 10;
                    }
                    break;
                case 'IMG':
                    var attribute = elm.attr('src');
                    if (attribute) {
                        state.stack[0].push("IMG[src=\"" + attribute + "\"]");
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
        };

        /**
         * Inspect the element's siblings by CSS Class names and compare them to the analyzed element.
         * @param {array} hierarchy. The hierarchy of elements
         * @param {object} state. The current calculated CSS selector
         */
        var analyzeElementCSSClasses = function (hierarchy, state, config) {

            for (var index = 0; index < hierarchy.length; index++) {
                var currentElem = hierarchy[index];
                // get class attribute
                var currentClasses = currentElem.attr('class');
                if (currentClasses && typeof currentClasses == 'string') {
                    // trim spaces
                    currentClasses = currentClasses.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    var classes = currentClasses.match(/([^\s]+)/gi);
                    if (classes) {
                        if (classes.length > 0) {
                            // add . before the first class
                            classes[0] = '.' + classes[0];
                        }
                        //limit to 10 classes
                        if (classes.length > 10) {
                            classes.splice(10, classes.length - 10);
                        }
                        for (var classIndex = 0; classIndex < classes.length; classIndex++) {
                            if (!validationHelpers.className(classes[classIndex])) {
                                classes.splice(classIndex, 1);
                            }
                        }
                        state.stack[index].push(classes.join('.'));
                        state.specificity += (10 * classes.length);
                    }
                }
            }

            return state;
        };

        /**
         * Inspect the element's siblings by index (nth-child) name and compare them to the analyzed element.
         * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
         * @param {array} hierarchy. The hierarchy of elements
         * @param {object} state. The current calculated CSS selector
         */
        var analyzeElementSiblings = function (hierarchy, state, config) {

            var hierarchyIndex = 0;
            while (hierarchyIndex < hierarchy.length && !state.verified) {
                // get siblings BEFORE out element
                var siblings = hierarchy[hierarchyIndex].prevAll();

                // get element's index by the number of elements before it
                // note that the nth-child selector uses a 1 based index, not 0
                var indexOfElement = siblings.length + 1;

                // add the rest of the siblings (those that come after ours)
                siblings = siblings.concat(hierarchy[hierarchyIndex].nextAll());

                // If the element has no siblings!
                // we have no need for the nth-child selector
                if (siblings.length != 0) {
                    var elementTag = hierarchy[hierarchyIndex].getTag();
                    var elementClasses = hierarchy[hierarchyIndex].getClasses();
                    var hasUniqueTag = true; // assume unique until proven otherwise
                    var hasUniqueClass = (elementClasses[0] instanceof Array && elementClasses[0].length > 0); // if the element has no class, we may still need the nth-child filter

                    for (var index = 0; index < siblings.length && (hasUniqueClass || hasUniqueTag); index++) {
                        var currentElem = siblings[index];
                        // nodeName is not a jQuery property, so we must go directly to the element
                        var currentTag = currentElem.getTag();
                        if (currentTag && currentTag == elementTag) {
                            hasUniqueTag = false;
                        }

                        // get the classes that exist on the element but not on his sibling
                        hasUniqueClass = (_.difference(elementClasses, currentElem.getClasses()).length > 0);
                    }


                    // if we don't have a unique tag or a unique class, then we need a nth-child to help us
                    // differenciate our element from the rest of the pack
                    if (!hasUniqueClass && !hasUniqueTag) {
                        state.stack[hierarchyIndex].push(':nth-child(' + indexOfElement + ')');

                        // Verify the selector as we don't want to go on and parse the parent's siblings
                        // if we don't have to!
                        state.verified = analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength);
                    }
                }

                hierarchyIndex++;
            }

            return state;
        };

        /**
         * Inspect the element's siblings by Tag name and Class name and compare them to the analyzed element.
         * The sibling comparison is done from level 0 (the analyzed element) upwards in the hierarchy, In an effort to avoid unneeded parsing.
         * @param {array} hierarchy. The hierarchy of elements
         * @param {object} state. The current calculated CSS selector
         */
        var analyzeTypedSiblings = function (hierarchy, state, config) {

            var hierarchyIndex = 0;
            while (hierarchyIndex < hierarchy.length && !state.verified) {
                // get siblings BEFORE out element and reverse
                var siblings = hierarchy[hierarchyIndex].prevAll().reverse();

                var indexOfElement = siblings.length;

                // add the rest of the siblings (those that come after ours)
                siblings = siblings.concat(hierarchy[hierarchyIndex].nextAll());

                // If the element has no siblings!
                // we have no need for the nth-child selector
                if (siblings.length != 0) {
                    var elementTag = hierarchy[hierarchyIndex].getTag();
                    var elementClasses = hierarchy[hierarchyIndex].getClasses();
                    var siblingClasses = [];
                    var hasUniqueTag = true; // assume unique until proven otherwise
                    var hasUniqueClass = (elementClasses[0] instanceof Array && elementClasses[0].length > 0); // if the element has no class, we may still need the nth-child filter
                    var typedIndex = 1; // the nth-of-type index of the element

                    for (var index = 0; index < siblings.length && (hasUniqueClass || hasUniqueTag); index++) {
                        var currentElem = siblings[index];
                        // nodeName is not a jQuery property, so we must go directly to the element
                        var currentTag = currentElem.getTag();
                        if (currentTag && currentTag == elementTag) {
                            if (index < indexOfElement) {
                                //only increment count if we have yet to reach the element
                                typedIndex++;
                            }

                            if (index + 1 >= indexOfElement) {
                                // if we are about to reach the element's index end the loop
                                // as we no longer need to count element with the same tag as his
                                hasUniqueTag = false;
                            }
                        }

                        // push to stack of classes
                        siblingClasses = siblingClasses.concat(currentElem.getClasses());
                    }

                    // get the classes that exist on the element but not on his siblings
                    var uniqueClasses = _.difference(elementClasses, siblingClasses);
                    hasUniqueClass = (uniqueClasses.length > 0);

                    // if we don't have a unique tag or a unique class, then we need a nth-child to help us
                    // differenciate our element from the rest of the pack
                    if (!hasUniqueClass && !hasUniqueTag) {
                        state.stack[hierarchyIndex].push(':nth-of-type(' + typedIndex + ')');

                        // Verify the selector as we don't want to go on and parse the parent's siblings
                        // if we don't have to!
                        state.verified = analyzeSelectorState(hierarchy[0], state, config.selectorMaxLength);
                    }
                }

                hierarchyIndex++;
            }

            return state;
        };


        /*
         Currently we have disabled the 'analyzeTypedSiblings' method.
         the nth-of-type selector has been removed due to the fact that
         it is unreliable and even  Sizzle doesn't support it.
         */
        this.methods = function(){
            return [
                analyzeElementID,
                analyzeElementAttributes,
                analyzeElementTag,
                analyzeElementCSSClasses,
                /* the nth-child selector has proven unreliable on badly built webpages. It breaks when one of the siblings has a non closed <br>, for example  */
                analyzeElementSiblings
            ];
        };

        // Internal functions for the parsing process

        var validationHelpers = {
            /**
             * Validate the syntax of a tagName to make sure that it has a valid syntax for the query engine.
             * Many libraries use invalid property and tag names, such as Facebook that use FB: prefixed tags.
             * These make the query engines fail and must be filtered out.
             * @param {string} tagName. The element's tag name
             */
            tagName : function (tagName) {
                if (typeof tagName == 'string' && tagName.match(/^[a-zA-Z0-9]+$/gi) != null) {
                    return tagName;
                }
                return false;
            },
            /**
             * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
             * @param {string} attribute. The element's attribute's value
             */
            attr: function (attribute) {
                if (typeof attribute == 'string' && attribute.match(/^[0-9a-zA-Z][a-zA-Z_\-\:0-9\.]*$/gi) != null) {
                    return attribute;
                }
                return false;
            },

            /**
             * Validate the syntax of an attribute to make sure that it has a valid syntax for the query engine.
             * @param {string} attribute. The element's attribute's value
             */
            className : function (className) {
                if (typeof className == 'string' && className.match(/^\.?[a-zA-Z_\-\:0-9]*$/gi) != null) {
                    return className;
                }
                return false;
            }
        };


        return this;
    })();

    /**
     * Handle errors in accordance with what is specified in the configuration
     * @param {object/string} ex. The exception object or message
     * @param {object} element. The element KanakanaK was asked to process
     */
    var onError = function (ex, element) {
        // handle error
        if (config.errorHandling === true) {
            throw ex;
        } else if (typeof config.errorHandling == 'function') {
            config.errorHandling(ex, element);
        }
    };

    /**
     * A DOM wrapper object. Provides both CSS selector querying for verifications and a wrapper for the elements them selves to provide
     * key behavioural methods, such as sibling querying etc.
     * @param {object} elementOrSelector. An element we wish to wrapper or a CSS query string
     */
    var $ = {
        query : function (selector) {
            if (typeof(selector) != 'string') {
                return false;
            }

            //selector library support
            if (config.queryEngine && _.isFunction(config.queryEngine)) {
                var result = config.queryEngine(selector);
                if (typeof(result) == 'object' && result.length !== undefined) {
                    return result;
                } else {
                    return [];
                }
            } else if (window.Sizzle) {
                return Sizzle(selector);
            } else if (window.jQuery) {
                return window.jQuery(selector).toArray();
            } else if (document && document.querySelectorAll && _.isFunction(document.querySelectorAll)) {
                try {
                    return document.querySelectorAll(selector);
                } catch(ex) {
                    // handle error
                    onError.call(KanakanaK,ex,null);
                }
            }
            // No library nor methods to use, so return an empty array - no CSS selector will ever be generated in this situation!
            return [];
        },
        /**
         * Verify a specific ID's uniqueness one the page
         * @param {object} element. The element we are trying to build a selector for
         * @param {object} state. The current selector state (has the stack and specificity sum)
         */
        isUniqueElementID : function (elementID) {
            // use selector to query an element and see if it is a one-to-one selection
            var results = this.query("[id='" + elementID + "']");
            return (results.length === 1);
        },
        wrap : function (elm) {

            /// When the DOM wrapper return the selected element it wrapps
            /// it with helper methods which aid in analyzing the result
            return {
                el:elm,

                attr:function (attribute) {
                    return this.el.getAttribute(attribute);
                },

                getTag:function () {
                    return this.el.nodeName;
                },

                getClass:function () {
                    var classValue = this.attr('class');
                    if (classValue) {
                        return classValue;
                    }
                    return '';
                },

                getClasses:function () {
                    var classValue = this.attr('class');
                    if (classValue && typeof classValue == 'string') {
                        // trim spaces
                        classValue = classValue.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        if (classValue != '') {
                            return classValue.split(' ');
                        }
                    }
                    return [];
                },

                prevAll:function (reverse) {
                    return this.dir("previousSibling");
                },

                nextAll:function () {
                    return this.dir("nextSibling");
                },

                parent:function () {
                    var parent = this.el.parentNode;
                    return parent && parent.nodeType !== 11 ? $.wrap(parent) : null;
                },

                dir:function (dir) {
                    var matched = [],
                        cur = this.el[ dir ];

                    while (cur && cur.nodeType !== 9) {
                        if (cur.nodeType === 1) {
                            matched.push($.wrap(cur));
                        }
                        cur = cur[dir];
                    }
                    return matched;
                }
            }
        }
    };

    /**
     * Internal generic helper functions
     * */

    // Functions borrowed from underscore.js with all the respect in the world
    var _ = {
        breaker   :{},
        contains  :function (obj, target) {
            var found = false;

            if (obj == null) return found;

            if (obj instanceof Array) {
                return obj.indexOf(target) != -1
            }

            found = this.any(obj, function (value) {
                return value === target;
            });
            return found;
        },
        any       :function (obj, iterator, context) {
            iterator = iterator || _.identity;
            var result = false;
            if (obj == null) return result;
            if (obj instanceof Array) {
                return obj.some(iterator, context);
            }
            this.each(obj, function (value, index, list) {
                if (result |= iterator.call(context, value, index, list)) {
                    return this.breaker;
                }
            });
            return !!result;
        },
        each      :function (obj, iterator, context) {
            if (obj == null) return;
            if (obj instanceof Array) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (i in obj && iterator.call(context, obj[i], i, obj) === this.breaker) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === this.breaker) return;
                    }
                }
            }
        },
        filter    :function (obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (obj instanceof Array) return obj.filter(iterator, context);
            this.each(obj, function (value, index, list) {
                if (iterator.call(context, value, index, list)) results[results.length] = value;
            });
            return results;
        },
        difference:function (array, other) {
            return this.filter(array, function (value) {
                return !this.contains(other, value);
            }, this);
        },
        isFunction : function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        }
    };

})(window,document);