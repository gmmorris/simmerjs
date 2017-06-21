// code utils
export const either = (value, left, right) =>
  value ? right(value) : left(value)
export const identity = i => i
export const compose = (f, ...fns) => {
  if (fns.length === 1) {
    const g = fns.pop()
    return (...args) => f(g(...args))
  }
  return (...args) => f(compose(...fns)(...args))
}
export const rcompose = (...fns) => {
  return compose(...fns.reverse())
}
export const mapfn = fn => arr => arr.map(fn)
export const reducefn = (fn, init) => arr => arr.reduce(fn, init)

// Dom utils
// use query in current scope
export const queryEngine = document => ({
  query: (...args) => {
    if (!document) {
      throw Error(
        'No global scoped document is available - somethign is wrong with the test runner'
      )
    }
    let elm = document.querySelectorAll(...args)
    if (elm && elm.length) {
      if (elm.length === 1) {
        return elm[0]
      }
      throw new Error(
        `Invalid number of elements returned for query: ${elm.join()}`
      )
    }
    return elm
  },
  default: true
})

export const setQueryFunction = (queryFn, name) => {
  queryEngine.default = false
  queryEngine.query = queryFn
  describe(`Simmer tests along side a ${name} selector engine`)
}

export const NoResult = { el: undefined, SimmerEl: false }

export const compareParentElementAndSimmer = (windowScope, elementSelector) => {
  const comp = compareElementsAndSimmer(windowScope, elementSelector)
  if (comp !== NoResult && comp.element) {
    comp.el = comp.el.parentNode
  }
  return comp
}

export const compareElementsAndSimmer = (windowScope, elementSelector) => {
  var element, selector
  if (typeof elementSelector === 'string') {
    element = windowScope.document.querySelectorAll(elementSelector)[0]
  } else {
    element = elementSelector
  }

  if (!element) {
    return NoResult
  }

  selector = windowScope.Simmer(element)
  if (selector === false) {
    return false
  }

  return {
    el: element,
    SimmerEl: queryEngine(windowScope.document).query(selector),
    selector: selector
  }
}
