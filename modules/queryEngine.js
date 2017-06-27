/**
 * Verify a specific ID's uniqueness one the page
 * @param {object} element. The element we are trying to build a selector for
 * @param {object} state. The current selector state (has the stack and specificity sum)
 */
export function isUniqueElementID (query, elementID) {
  // use selector to query an element and see if it is a one-to-one selection
  var results = query(`[id="${elementID}"]`) || []
  return results.length === 1
}

function traverseAttribute (el, dir) {
  const matched = []
  let cur = el[dir]

  while (cur && cur.nodeType !== 9) {
    if (cur.nodeType === 1) {
      matched.push(wrap(cur))
    }
    cur = cur[dir]
  }
  return matched
}

export function wrap (el) {
  /// When the DOM wrapper return the selected element it wrapps
  /// it with helper methods which aid in analyzing the result
  return {
    el,

    getClass: function () {
      return this.el.getAttribute('class') || ''
    },

    getClasses: function () {
      return this.getClass()
        .split(' ')
        .map(className => className.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))
        .filter(className => className.length > 0)
    },

    prevAll: function () {
      return traverseAttribute(this.el, 'previousSibling')
    },

    nextAll: function () {
      return traverseAttribute(this.el, 'nextSibling')
    },

    parent: function () {
      return this.el.parentNode && this.el.parentNode.nodeType !== 11
        ? wrap(this.el.parentNode)
        : null
    }
  }
}

const INVALID_DOCUMENT = {
  querySelectorAll () {
    throw new Error(
      'An invalid context has been provided to Simmer, it doesnt know how to query it'
    )
  }
}

const documentQuerySelector = scope => {
  const document = typeof scope.querySelectorAll === 'function'
    ? scope
    : scope.document ? scope.document : INVALID_DOCUMENT
  return (selector, onError) => {
    try {
      return document.querySelectorAll(selector)
    } catch (ex) {
      // handle error
      onError(ex)
    }
  }
}

/**
 * A DOM manipulation object. Provides both CSS selector querying for verifications and a wrapper for the elements them selves to provide
 * key behavioural methods, such as sibling querying etc.
 * @param {object} elementOrSelector. An element we wish to wrapper or a CSS query string
 */
export default function (scope, configuredQueryEngine) {
  const queryEngine = typeof configuredQueryEngine === 'function'
    ? configuredQueryEngine
    : documentQuerySelector(scope)

  // If no selector we return an empty array - no CSS selector will ever be generated in this situation!
  return (selector, onError) =>
    typeof selector !== 'string' ? [] : queryEngine(selector, onError, scope)
}
