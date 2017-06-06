
/**
 * Verify a specific ID's uniqueness one the page
 * @param {object} element. The element we are trying to build a selector for
 * @param {object} state. The current selector state (has the stack and specificity sum)
 */
export function isUniqueElementID ($DOM, elementID) {
  // use selector to query an element and see if it is a one-to-one selection
  var results = $DOM.query(`[id="${elementID}"]`) || [];
  return (results.length === 1);
}

export function wrap (el) {
  /// When the DOM wrapper return the selected element it wrapps
  /// it with helper methods which aid in analyzing the result
  return {
    el,
    
    getClass: function () {
      var classValue = this.el.getAttribute('class');
      if (classValue) {
        return classValue;
      }
      return '';
    },

    getClasses: function () {
      var classValue = this.el.getAttribute('class');
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
      return parent && parent.nodeType !== 11 ? wrap(parent) : null;
    },

    dir: function (dir) {
      var matched = [],
      cur = this.el[dir];

      while (cur && cur.nodeType !== 9) {
        if (cur.nodeType === 1) {
          matched.push(wrap(cur));
        }
        cur = cur[dir];
      }
      return matched;
    }
  };
}

/**
   * A DOM manipulation object. Provides both CSS selector querying for verifications and a wrapper for the elements them selves to provide
   * key behavioural methods, such as sibling querying etc.
   * @param {object} elementOrSelector. An element we wish to wrapper or a CSS query string
   */
export default function (windowScope) {
  var QueryEngine = function () {
    //selector library support
    this.attachQueryEngine = function (queryEngine, onError, Simmer) {
      const { document } = windowScope
      if (!(queryEngine && typeof queryEngine === 'function')) {
          this.queryEngine = function (selector) {
            try {
              return document.querySelectorAll(selector);
            } catch (ex) {
              // handle error
              onError.call(Simmer, ex, null);
            }
          };
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
  return QueryEngine;
}
