/**
   * A DOM manipulation object. Provides both CSS selector querying for verifications and a wrapper for the elements them selves to provide
   * key behavioural methods, such as sibling querying etc.
   * @param {object} elementOrSelector. An element we wish to wrapper or a CSS query string
   */
  export default function (windowScope, domProto) {
    'use strict';

    var QueryEngine = function () {
      //selector library support
      this.attachQueryEngine = function (queryEngine, onError, Simmer) {
        const { document } = windowScope
        if (!(queryEngine && typeof queryEngine === 'function')) {
          if (windowScope.Sizzle) {
            this.queryEngine = function (selector) {
              try {
                return windowScope.Sizzle(selector);
              } catch (ex) {
                // handle error
                onError.call(Simmer, ex, null);
              }
            };
          } else if (windowScope.jQuery) {
            this.queryEngine = function (selector) {
              try {
                return windowScope.jQuery(selector).toArray();
              } catch (ex) {
                // handle error
                onError.call(Simmer, ex, null);
              }
            };
          } else if (document && document.querySelectorAll && typeof document.querySelectorAll === 'function') {
            this.queryEngine = function (selector) {
              try {
                return document.querySelectorAll(selector);
              } catch (ex) {
                // handle error
                onError.call(Simmer, ex, null);
              }
            };
          }
        } else {
          this.queryEngine = queryEngine;
        }
      };
      this.query = function (selector) {
        if (typeof selector !== 'string' || typeof this.queryEngine !== 'function') {
          // No selctor, library nor methods to use, so return an empty array - no CSS selector will ever be generated in this situation!
          return [];
        }
        return this.queryEngine(selector);
      };
    };
    QueryEngine.prototype = domProto;
    return QueryEngine;
  }

export const domProto = {
    /**
     * Verify a specific ID's uniqueness one the page
     * @param {object} element. The element we are trying to build a selector for
     * @param {object} state. The current selector state (has the stack and specificity sum)
     */
    isUniqueElementID: function (elementID) {
      // use selector to query an element and see if it is a one-to-one selection
      var results = this.query('[id="' + elementID + '"]');
      return (results.length === 1);
    },
    wrap: function (elm) {
      var $DOM= this;
      /// When the DOM wrapper return the selected element it wrapps
      /// it with helper methods which aid in analyzing the result
      return {
        el: elm,

        attr: function (attribute) {
          return this.el.getAttribute(attribute);
        },

        getTag: function () {
          return this.el.nodeName;
        },

        getClass: function () {
          var classValue = this.attr('class');
          if (classValue) {
            return classValue;
          }
          return '';
        },

        getClasses: function () {
          var classValue = this.attr('class');
          if (classValue && typeof classValue === 'string') {
            // trim spaces
            classValue = classValue.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            if (classValue !== '') {
              return classValue.split(' ');
            }
          }
          return [];
        },

        prevAll: function () {
          return this.dir('previousSibling');
        },

        nextAll: function () {
          return this.dir('nextSibling');
        },

        parent: function () {
          var parent = this.el.parentNode;
          return parent && parent.nodeType !== 11 ? $DOM.wrap(parent) : null;
        },

        dir: function (dir) {
          var matched = [],
          cur = this.el[dir];

          while (cur && cur.nodeType !== 9) {
            if (cur.nodeType === 1) {
              matched.push($DOM.wrap(cur));
            }
            cur = cur[dir];
          }
          return matched;
        }
      };
    }
  }
