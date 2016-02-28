import { applyFixture } from './fixture';
import { test } from 'tape';
// code utils
export const either = (value, left, right)  => value? right(value) : left(value)
export const identity = i => i
export const compose = (f, ...fns) => {
  if (fns.length == 1) {
    const g = fns.pop();
    return (...args) => f(g(...args));
  }
  return (...args) => f(compose(...fns)(...args));
};
export const rcompose = (...fns) => {
  return compose(...fns.reverse());
};
export const mapfn = fn => (arr) => arr.map(fn)
export const reducefn = (fn, init) => (arr) => arr.reduce(fn, init)

export const describe = (name, fn) => {
  test(`# - ${name.toUpperCase()} -`,(t)=>{ t.end() });
  typeof fn === 'function'? fn() : null;
}

// Dom utils
// use query in current scope
export const queryEngine = {
  query : (...args) => {
    if(!document){
      throw Error('No global scoped document is available - somethign is wrong with the test runner');
    }
    let elm = document.querySelectorAll(...args);
    if(elm && elm.length){
      if(elm.length === 1) {
        return elm[0];
      }
      throw(`Invalid number of elements returned for query: ${elm.join()}`)
    }
    return elm;
  },
  default: true
}

export const setQueryFunction = (queryFn, name) => {
  queryEngine.default = false;
  queryEngine.query = queryFn;
  describe(`Simmer tests along side a ${name} selector engine`);
}

export const NoResult = { el: undefined, SimmerEl: false };

export const compareParentElementAndSimmer = elementSelector => {
  const comp = compareElementsAndSimmer(elementSelector);
  if(comp !== NoResult && comp.element) {
    comp.element = element.parentNode;
  }
  return comp;
}

export const compareElementsAndSimmer = elementSelector => {
    var element, selector;
    if (typeof elementSelector === 'string') {
      element = document.querySelectorAll(elementSelector)[0];
    } else {
      element = elementSelector;
    }

    if (!element) {
      return NoResult;
    }

    selector = window.Simmer(element);
    if (selector === false) {
      return false;
    }

    return {
      el: element,
      SimmerEl: queryEngine.query(selector),
      selector: selector
    };
  }

  export const applyDOM = () => {
    applyFixture(document.getElementsByTagName('body')[0]);
  }
